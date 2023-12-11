# abhimaanBackend
<h1 align="center">Abhimaan Innovation </h1>

## Deployed link

<br>
https://abhimaan.onrender.com/

<br>

## Installation

```
npm install
```

## Start the Backend server 

```
npm run server
```


<br>

##  MVC Structure

```

     ├── config
     |    └── config.js
     ├── controllers
     |    └── pollController.js
     |    └── userController.js
     ├── middleware
     |    └── middleware.js
     |    
     ├── models
     |    └── pollModel.js
     |    
     ├──routes
     |    └── polls.route.js
     |    └── user.route.js
     └── index.js
```
Things to do before starting the server:- 

-  create `.env` file and put "PORT", "sqlPassword", "database".
- "PORT" is for listening the server.
- "sqlPassword" write your sql password here.
- "database" write your database name here

<br>

## Schema 

<br>

<h3><strong>Schema for signUp</strong><h3>

```js

{
    "name": "enter your name ,
    "email": "enter your email here",
    "password": "enter your password here"
   
}
```
<h3><strong>Login Schema </strong><h3>

```js

{
 
    "email": "enter your email here",
    "password": "enter your password here"
}
```

<h3><strong>Schema for create polls and question</strong><h3>

```js
{
  "title": "Poll1",
  "category": "General studies",
  "startDate": "2023-12-5",
  "endDate": "2023-12-15",
  "minReward": 15,
  "maxReward": 30,
  "questionSets": [
    {
      "questionType": "single",
      "questionText": "What is the capital of France?",
      "options": {
        "a": "Paris",
        "b": "Berlin",
        "c": "London",
        "d": "Madrid"
      },
      "rightOption":"a"
    },
    {
      "questionType": "multiple",
      "questionText": "Which of the following are mammals?",
      "options": {
        "a": "Dog",
        "b": "Cat",
        "c": "Fish",
        "d": "Snake"
      },
      "rightOption":"b"
    },
    {
      "questionType": "single",
      "questionText": "What is the largest planet in our solar system?",
      "options": {
        "a": "Earth",
        "b": "Jupiter",
        "c": "Mars",
        "d": "Venus"
      },
      "rightOption":"d"
    }
   
  ]
}
```
<h3><strong>Submit poll Schema </strong><h3>

```js

{
 "pollId":"your pollId here",
"questioned":"question Id here",
"selectedOption":"selected Option here"
   
}
```
## Endpoints

<table>
    <thead>
        <tr>
            <th>METHOD</th>
            <th>ENDPOINT</th>
            <th>DESCRIPTION</th>
            <th>STATUS CODE</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>POST</td>
            <td>/user/signup</td>
            <td>This endpoint should allow users to register</td>
            <td>201</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>/user/login</td>
            <td>This endpoint should allow users to login.</td>
            <td>201</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>/poll/createPoll</td>
            <td>This endpoint is used to create new poll along with questions</td>
            <td>201</td>
        </tr>
         <tr>
            <td>GET</td>
            <td>/poll/getAllPolls</td>
            <td>This endpoint fetched all data of polls along with question sets</td>
            <td>200</td>
        </tr>
         <tr>
            <td>PUT</td>
            <td>/poll/updatePoll/:pollId</td>
            <td>This endpoint is used to update details in selected polls by their pollId which we have to pass in params </td>
            <td>201</td>
        </tr>
        <tr>
            <td>GET</td>
            <td>/poll/serveQuestion/:userId</td>
            <td>This endpoint is userd to serve question along with related polls if valid token present in headers authorization with Bearer</td>
            <td>201</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>/poll/submitPoll/:userId</td>
            <td>This endpoint use to submit answer on poll by their userId which we have to pass in params if valid token present in headers authorization with Bearer</td>
            <td>201</td>
        </tr> 
      <tr>
            <td>GET</td>
            <td>/pollAnalytics/:pollId</td>
            <td>This endpoint use to get poll analytics by their pollId which we have to pass in params </td>
            <td>200</td>
        </tr>
       <tr>
            <td>GET</td>
            <td>/allPollAnalytics</td>
            <td>This endpoint use to get poll analytics </td>
            <td>200</td>
        </tr>
    </tbody>
</table>


<br>

## Thank you for visiting

