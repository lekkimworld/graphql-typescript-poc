# Typescript GraphQL Proof-of-Concept #
This is a simple PoC for using GraphQL from Typescript. When using the PoC the roles used to guard the queries in the Resolvers are read from the `scopes` value of the JWT (split into an array by the space character).

## Configuration ##
Add the following environment variables or use a `.env` file which is read on startup.
* `JWT_SECRET` Set to the secret to use for signing JWT's
* `NODE_ENV` Set to `development` / `production` as you wish. Setting to `development` turns on the GraphQL Playground.
* `GRAPHQL_ENABLE_PLAYGROUND` Basically the same as `NODE_ENV` but since this is set to `production` in Heroku this setting allows you to turn on the GraphQL Playground there as well.

