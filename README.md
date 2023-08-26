Phonetic API and frontend
=========================

Calculate if two separate list of words are homophones as:

 * In German using [Colgne phnoetics](https://en.wikipedia.org/wiki/Cologne_phonetics) as implemented by https://github.com/provinzkraut/cologne_phonetics.
 * In English using [Soundex](https://en.wikipedia.org/wiki/Soundex) as implemented by https://github.com/Lilykos/pyphonetics.
 * In English using [Metaphone](https://en.wikipedia.org/wiki/Soundex) as implemented by https://github.com/Lilykos/pyphonetics.

![Screenshot from 2023-08-26 15-56-21](https://github.com/aivuk/phonetics/assets/272892/3e21a9eb-14a4-4b78-a4d6-79ccb1f6de64)


Here is working [demo](https://homophones.vaz.io).

API documentation [here](https://homophones.vaz.io/api/docs) or [here in redoc](https://homophones.vaz.io/api/redoc).

## Running with docker-compose

Change docker-compose if necessary, specially the services port number. Run it with:

`$ docker-compose up`

## Running the API

Create first a python virtual environment and activate it:

1. `python -m venv ~/phonetic-env`
2. `source ~/phonetic-env/bin/activate`
3. `cd phoneticapi && pip install -r requirements.txt`
4. `uvicorn main:app`

## Building the frontend

1. `cd phoneticapi-frontend`
2. `yarn`
3. `yarn run dev` # or `yarn run build`
