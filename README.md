Phonetic API and frontend
=========================

Calculate if two separate list of words are homophones of each other using [Colgne phnoetics](https://en.wikipedia.org/wiki/Cologne_phonetics) as implemented by https://github.com/provinzkraut/cologne_phonetics.

![Screenshot from 2023-08-25 18-25-26](https://github.com/aivuk/phonetics/assets/272892/ccb31588-db27-4033-8937-2b6db0308da2)


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
