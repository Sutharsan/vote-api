### Endpoints
All return data in json format.

GET /vote/{id}
  Returns: Average vote data
GET /vote/{id}/stats
  Returns: Average vote and vote count
POST /vote/{id}/{[1..5]}
  Returns: Average vote data

## Development
Run: `npm run start`

### Nodemon
To restart the node server during development use Nodemon: https://nodemon.io/
Configuration in package.json (in nodemonConfig).

### Babel
Transpile with babel: `node_modules/.bin/babel src --out-dir dist`
