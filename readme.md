# Headless voting application.
 
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
- Run: `npm run start`
- Build: `npm run build`
