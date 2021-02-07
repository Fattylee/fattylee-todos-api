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
 ```js
 Get /  home page for Api Docs
 ```

<table>
<tr><th>HTTP VERB</th><th>ENDPOINT</th><th>FUNCTIONALITY</th></tr>
<tr><td>GET</td><td>todos</td><td>Get all todos that belongs to user</td></tr>
<tr><td>GET</td><td>/todos/todoID</td><td>Get a todo by ID</td></tr>
<tr><td>POST</td><td>/todos</td><td>Create a todo</td></tr>
<tr><td>DELETE</td><td>/todos/id</td><td>Delete a todo</td></tr>
<tr><td>DELETE</td><td>/todos</td><td>Delete all todos</td></tr>
<tr><td>GET</td><td>/users</td><td>Get all users</td></tr>
<tr><td>POST</td><td>/users</td><td>Create a user</td></tr>
<tr><td>GET</td><td>todos/admin</td><td>Get all todos</td></tr>
<tr><td>DELETE</td><td>/users</td><td>Delete all users</td></tr>
<tr><td>DELETE</td><td>/users/id</td><td>Delete a user</td></tr>
<tr><td>PATCH</td><td>/users/admin/id</td><td>Add admin priviledge a user</td></tr>
<tr><td>DELETE</td><td>/users/admin/id</td><td>Revoke admin priviledge from a user</td></tr>
<tr><td>GET</td><td>/users/auth</td><td>Get auth user</td></tr>
<tr><td>POST</td><td>/users/login</td><td>User login</td></tr> 
<tr><td>DELETE</td><td>/users/auth/token</td><td>Logout user</td></tr>
</table>
