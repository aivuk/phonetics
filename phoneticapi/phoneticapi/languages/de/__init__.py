#!/usr/bin/env python
# -*- coding: utf-8 -*-

import cologne_phonetics as cp
from phoneticapi.base.homophones import HomophonesDetector


class Detector(HomophonesDetector):
    language = "German 🇩🇪"
    method = "Cologne Phonetics"
    reference = "https://en.wikipedia.org/wiki/Cologne_phonetics"

    def compare(self, word1: str, word2: str) -> bool:
        return cp.compare(word1, word2)
