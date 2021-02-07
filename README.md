# node-web-service

Fattylee-web-services is a web application for keeping track of one's todo. which support all `CRUD` operations.

## learn everything about NODEJS

You will learn so much about `RESTfUL API's. Just switch to any commit to experiment and learn what is in that `commit`. have fun as ever!

[View release version here](https://fattylee-todos-api.herokuapp.com)

## Table of Content

[Features](#features)<br>
[Technology](#technologies-and-languages)<br>
[Installation](#installation)<br>
[Testing](#testing)<br>
[API Docs](#api-docs)

## Features

Below are the features of my Fattylee-web-services app

### Users

Users can Signup on the app<br/>
Users can Login on the app<br/>
Users can create a todo<br/>
Users can Get all todos<br/>
Users can Get a todo<br/>
Users can Update a todo<br/>
Users can Delete a todo<br/>
Users with admin privilege can grant admin priviledge<br/>
Users with admin privilege can delete a user with admin priviledge<br/>
Auth user can retrieve self info
Users can logout

## Technologies and Languages

Modern JavaScript technologies were adopted in this project

ES2015: Also known as ES6 or ECMASCRIPT 6, is a new and widely used version of Javascript
that makes it compete healthily with other languages. See [here](https://en.wikipedia.org/wiki/ECMAScript) for more infromation.

NodeJS: Node.js is an open-source, cross-platform JavaScript run-time environment which allows you enjoy the features of Javascript off the web browsers and implement server-side web development.
Visit [here](https://nodejs.org/en/) for more information.

ExressJS: This is the web application framework for Node.js
Visit [here](https://expressjs.com) for more information.

MongoDB, Mongoose ORM, Jsonwebtoken for authentication and authorization, Bcryptjs to mention a few.

## Installation

1. Clone this repository into your local computer:

```
git clone https://github.com/Fattylee/fattylee-todos-api.git
```

2. Navigate into the cloned repository in your computer:

```
$ cd fattylee-todos-api
```

3. Install dependencies by running.

```
$ npm install
```

4. Create a `.env` file and fill the credencials using the `.env.sample` file sample at the root directory

5. Start the application by running

```
$ npm run start:dev
```

6. Install postman to test all endpoint

## Testing

- run test using `npm test`

## API Docs 

<table>
<tr><th>HTTP VERB</th><th>ENDPOINT</th><th>FUNCTIONALITY</th></tr>

<tr><td>POST</td> <td>api/v1/users/auth/signup</td>  <td>Register a user</td></tr>


path:

 `./servers/server.js`
 
 ```js
 Get /  home page for Api Docs
 ```
 
 <tr><td>GET</td> <td>api/v1/todos/todoID</td>  <td>Get a todo by ID</td></tr>
 
 ```js
 GET /todos  get all todos
 ```
 
```js
POST /todos  create a todo
```

```js
DELETE /todos/id  delete a todo
```

```js
DELETE /todos  delete all todo
```
 
```js
GET /users  get all users 
```
 
```js
POST /users  create a user
```

```js
GET /todos/admin  get all todos
```

```js
DELETE /users  delete all users 
```

```js
DELETE /users/id  delete a user
```

```js
PATCH /users/admin/id  	add admin priviledge to a user
```

```js
DELETE /users/admin/id  delete admin priviledge from a user
```

```js
GET /users/auth  get auth user
```
 
```js
POST /users/login  user login
```

```js
DELETE /users/auth/token  logout a user 
```
