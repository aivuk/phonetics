#!/usr/bin/env python
# -*- coding: utf-8 -*-

from typing import Union
import itertools
from pydantic import BaseModel, Field
import cologne_phonetics as cp
import pkgutil
import psycopg2
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Response, status

SUPPORTED_LANGUAGES = set()

for language_module in pkgutil.iter_modules(['languages']):
    SUPPORTED_LANGUAGES.add(language_module.name)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = psycopg2.connect(user='postgres', host='db', password='thisisasecret')

class Words(BaseModel):
    lang: str = Field(description="Language code", example="de")
    words1: str = Field(description="One or more words separate by spaces to compare with word2")
    words2: str = Field(description="One or more words separate by spaces to compare with word1")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "lang": "de",
                    "words1": "Dienstag",
                    "words2": "Diensttag"
                }
            ]
        }
    }

@app.post("/phonetic/")
async def compare_words(words: Words, response: Response):
    """
        Compare list of words phonetically using different methods for each language
    """

    cur = conn.cursor()

    if words.lang not in SUPPORTED_LANGUAGES:
        response = status.HTTP_406_NOT_ACCEPTABLE
        return {'error': 'Language "{}" not supported. Try one of {}'.format(words.lang, SUPPORTED_LANGUAGES)}
    else:
        words1 = words.words1.split()
        words2 = words.words2.split()
        if len(words1) != len(words2):
            response = status.HTTP_406_NOT_ACCEPTABLE
            return {'error': 'Strings with different number of words'}
        else:
            homophones = True
            for words_pair in zip(words1, words2):
                is_pair_homophone = cp.compare(words_pair[0], words_pair[1])
                if is_pair_homophone:
                    # check first if pair of words already exist in the dictionary
                    cur.execute('select count(*) from homophones where (word1 = %s and word2 = %s and lang = %s) or (word2 = %s and word1 = %s and lang = %s)', 
                                (words_pair[0], words_pair[1], words.lang, words_pair[1], words_pair[0], words.lang))
                    results_count = cur.fetchone()[0]
                    if results_count == 0:
                        cur.execute('insert into homophones (word1, word2, lang) values (%s, %s, %s)', (words_pair[0], words_pair[1], words.lang))
                        conn.commit()
                homophones &= is_pair_homophone                
            return {'homophones': homophones}

