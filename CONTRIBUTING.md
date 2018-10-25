# middyjs-middleware

* Middleware for use with middyjs 🛵 [middyjs](https://github.com/middyjs/middy)

## Pre-requisites

* Install docker [download here](https://www.docker.com/docker-mac).

## Running the project

* Clone the repository
* Inside the root folder of the project run `docker-compose up`.

## Testing and linting the app
* Run an instance of the docker container with:

```bash
docker-compose run middyjs_middleware bash
```

* To run the tests:

```bash
yarn test
```

* To run the linter run:

```
yarn lint
```

* To commit using commitizen

```
yarn commit
```

Then follow the prompts onscreen
