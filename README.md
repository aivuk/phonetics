Phonetic API and frontend
=========================

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
