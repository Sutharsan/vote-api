# Headless voting application.

## Installation
- Build: `npm run build`
- Run `npm run serve`

## Configuration
Override the default configuration using a .env file in the application root.
See src/config for variables to set.

## Endpoints
- Cast a vote
  POST /vote/{id}/{[1..5]}
    Returns: Average vote data
- Get the vote average
  GET /vote/{id}
    Returns: Vote count and average vote data
- Get vote statistics
  GET /vote/{id}/stats
    Returns: Average, vote count and vote count per option

All return data in json format.

## Development
- Start development: `npm run start`
