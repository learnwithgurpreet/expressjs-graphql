# GraphQl Service with ExpressJS

This example explains you usage of GraphQl with ExpressJS services, later you can use the same setup with any other platform (Eg: Vue.js, AngularJS). mLabs is being used to store documents.

## Architecture Diagram

![graphql_server](https://user-images.githubusercontent.com/3865313/197401452-a98444f3-aa9e-4a7e-8a29-4fd6c0e8566c.jpg)

## Libs/Frameworks

<ul>
  <li>ExpressJS</li>
  <li>ExpressJS GraphQl</li>
  <li>Mongoose</li>
</ul>

## Installation guide

```
$ npm install
# Create a .env file on root with following secrets:
SECRET_KEY=YOUR_SUPER_SECRET_KEY_FOR_JWT

$ npm start
Kudos, you are all set with graphQl server.
Note: Default port is 3000 and end point is localhost:3000/graphql
```
