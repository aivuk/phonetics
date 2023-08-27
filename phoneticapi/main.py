#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from typing import Union
import importlib
from pydantic import BaseModel, Field
import cologne_phonetics as cp
import pkgutil
import psycopg2
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Response, status
import phoneticapi.languages

LANGUAGE_DETECTOR = dict()

for language_module in pkgutil.iter_modules(phoneticapi.languages.__path__):
    mod = importlib.import_module(
        "phoneticapi.languages.{}".format(language_module.name)
    )
    LANGUAGE_DETECTOR[language_module.name] = mod.Detector()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = psycopg2.connect(
    user="postgres", host="db", password=os.getenv("POSTGRES_PASSWORD", "thisisasecret")
)


class Words(BaseModel):
    lang: str = Field(description="Language code", example="de")
    words1: str = Field(
        description="One or more words separate by spaces to compare with word2"
    )
    words2: str = Field(
        description="One or more words separate by spaces to compare with word1"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [{"lang": "de", "words1": "Dienstag", "words2": "Diensttag"}]
        }
    }


@app.get("/supported_languages")
async def get_languages():
    """
    Returns list of supported languages/methods by the /phonetic/ endpoint
    """

    langs = []
    for lang, det in LANGUAGE_DETECTOR.items():
        langs.append(
            {"language": det.language, "method": det.method, "reference": det.reference}
        )
    return langs


@app.get("/words_pairs/{lang}")
async def get_word_pairs(lang: str):
    """
    Returns dictionary of words that are homophones for a specific language
    """

    cur = conn.cursor()

    cur.execute(
        "select word1, word2, pair_count from homophones where lang = %s", (lang,)
    )
    results = cur.fetchall()
    return results


@app.post("/phonetic/")
async def compare_words(words: Words, response: Response):
    """
    Compare list of words phonetically using different methods for each language
    """

    cur = conn.cursor()

    if words.lang not in LANGUAGE_DETECTOR:
        response = status.HTTP_406_NOT_ACCEPTABLE
        return {
            "error": 'Language "{}" not supported. Try one of {}'.format(
                words.lang, [l for l in LANGUAGE_DETECTOR.keys()]
            )
        }
    else:
        detector = LANGUAGE_DETECTOR[words.lang]
        words1 = words.words1.split()
        words2 = words.words2.split()
        if len(words1) != len(words2):
            response = status.HTTP_406_NOT_ACCEPTABLE
            return {"error": "Strings with different number of words"}
        else:
            homophones = True
            for words_pair in zip(words1, words2):
                # If the words are the same we don't need to do anything
                if words_pair[0] == words_pair[1]:
                    continue
                is_pair_homophone = detector.compare(words_pair[0], words_pair[1])
                if is_pair_homophone:
                    # check first if pair of words already exist in the dictionary
                    cur.execute(
                        "select count(*) from homophones where (word1 = %s and word2 = %s and lang = %s) or (word1 = %s and word2 = %s and lang = %s)",
                        (
                            words_pair[0],
                            words_pair[1],
                            words.lang,
                            words_pair[1],
                            words_pair[0],
                            words.lang,
                        ),
                    )
                    results_count = cur.fetchone()[0]
                    if results_count == 0:
                        cur.execute(
                            "insert into homophones (word1, word2, lang) values (%s, %s, %s)",
                            (words_pair[0], words_pair[1], words.lang),
                        )
                        conn.commit()
                    else:
                        cur.execute(
                            """
                           update homophones set pair_count = pair_count + 1 
                            where 
                               (lang = %s and word1 = %s and word2 = %s) 
                                or      
                               (lang = %s and word1 = %s and word2 = %s)""",
                            (
                                words.lang,
                                words_pair[0],
                                words_pair[1],
                                words.lang,
                                words_pair[1],
                                words_pair[0],
                            ),
                        )
                        conn.commit()

                homophones &= is_pair_homophone
            return {"homophones": homophones}
