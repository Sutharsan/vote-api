#Voting API

An headless voting processor. Processes incoming votes, stores the result and 
returns statistics.
 
##Endpoints
- POST /vote/{id}/{vote value}
  id {string}:  Unique id that identifies the voted item.
  vote value {int}: Value >= 1 of the casted vote.
  Response body contains vote statistics as in GET /vote/{id}
- GET /vote/{id}
  id {string}: Unique id that identifies the voted item.
  Return: json response containing
    average {float}: Average of casted votes for this ID.
    count {int}: Total number of casted votes.
In cast of error, the respons contains:
  TODO HTML response status number
  error {string}: Description of the detected error. 


##Commands

To start node
```
npm start
```

To run ESLint
```
npm run eslint
```
To run ESLint and fix problems automatically
```
npm run eslint-fix
```


