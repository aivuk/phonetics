#!/usr/bin/env python
# -*- coding: utf-8 -*-

from pyphonetics import Metaphone
from phoneticapi.base.homophones import HomophonesDetector 

class Detector(HomophonesDetector):
    languages = 'English'
    method = 'Metaphone'
    reference = 'https://en.wikipedia.org/wiki/Soundex'
    metaphone = Metaphone()

    def compare(self, word1: str, word2: str) -> bool:
        return self.metaphone.sounds_like(word1, word2)
