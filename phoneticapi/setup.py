#!/usr/bin/env python
# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

setup(
    name="phoneticapi",
    version="0.1",
    description="FastAPI with different homophones detector methods",
    long_description=open("README.md").read(),
    url="https://github.com/aivuk/phonetics/",
    author="Edgar Zanella Alvarenga",
    author_email="e@vaz.io",
    license="AGPLv3",
    packages=find_packages(exclude=["tests", "tests.*"]),
    zip_safe=False,
)
