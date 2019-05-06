### Endpoints
All return data in json format.

GET /vote/{id}
  Returns: Average vote data
GET /vote/{id}/stats
  Returns: Average vote and vote count
POST /vote/{id}/{[1..5]}
  Returns: Average vote data

## Development

### Nodemon
To restart the node server during development use Nodemon: https://nodemon.io/
Install: `npm install -g nodemon`
Start: `nodemon app.js`

