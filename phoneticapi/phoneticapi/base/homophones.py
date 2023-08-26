#!/usr/bin/env python
# -*- coding: utf-8 -*-

from abc import ABCMeta, abstractmethod, abstractproperty

class HomophonesDetector:
    __metaclass__ = ABCMeta

    # Language Name (e.g. German)'
    @abstractproperty
    def language(self):
        pass

    # 'Method Name (e.g. Colgne Phonetics)'
    @abstractproperty
    def method(self):
        pass

    # 'An reference for the method, an URL, a preprint, etc'
    @abstractproperty
    def reference(self):
        pass

    @abstractmethod
    def compare(word1: str, word2: str) -> bool:
        pass
