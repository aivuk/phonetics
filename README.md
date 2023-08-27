Phonetic API and frontend
=========================

Calculate if two separate list of words are homophones as:

 * In German using [Cologne phonetics](https://en.wikipedia.org/wiki/Cologne_phonetics) as implemented by https://github.com/provinzkraut/cologne_phonetics.
 * In English using [Soundex](https://en.wikipedia.org/wiki/Soundex) as implemented by https://github.com/Lilykos/pyphonetics.
 * In English using [Metaphone](https://en.wikipedia.org/wiki/Soundex) as implemented by https://github.com/Lilykos/pyphonetics.

![Screenshot from 2023-08-26 15-56-21](https://github.com/aivuk/phonetics/assets/272892/3e21a9eb-14a4-4b78-a4d6-79ccb1f6de64)


Here is working [demo](https://homophones.vaz.io).

API documentation [here](https://homophones.vaz.io/api/docs) or [here in redoc](https://homophones.vaz.io/api/redoc).

## Running with docker-compose

First you do need to copy .env.sample to .env and change it if you want.

`cp .env.sample .env`

If you don't do the step above the database container will not be initialized. Just copy the file and run `docker-compose build`.
Change docker-compose.yml if necessary, specially the services port number. Run it with:

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

If you want to ran the development server with `yarn run dev` and use a running backend in the docker container you will need to 
change .env.development `VITE_API_URL` to point to your container address and port (if you haven't changed the docker-compose.yml
this is 'http://localhost:8082').
