#!/usr/bin/env python
# -*- coding: utf-8 -*-

from pyphonetics import Soundex
from phoneticapi.base.homophones import HomophonesDetector


class Detector(HomophonesDetector):
    language = "English 🇺🇸"
    method = "Soundex"
    reference = "https://en.wikipedia.org/wiki/Soundex"
    soundex = Soundex()

    def compare(self, word1: str, word2: str) -> bool:
        return self.soundex.sounds_like(word1, word2)
