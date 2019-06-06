import express from 'express';
import { param, validationResult } from 'express-validator/check';
import { addVote, getVoteAverage, getVoteCount } from '../vote-storage';

export const routerVote = express.Router();

/**
 * Error middleware: Handles error and send response with (some) details.
 */
export async function handleError(error, request, response, next) {
  if (response.headersSent) {
    // TODO Log error?
    process.exit();
  }

  await response
    .status(500)
    .json({
      error: error.message,
    });
}

/**
 * Route middleware: Defines the GET vote average endpoint.
 */
routerVote.get('/:id', (request, response, next) => {
  const { id } = request.params;

  getVoteAverage(id)
    .then(average => response.json(average.public()))
    .catch(next);
});

/**
 * Route middleware: Defines the GET vote statistics route.
 */
routerVote.get('/:id/stats', (request, response, next) => {
  const { id } = request.params;
  let average;
  let count;

  Promise.all([
    getVoteAverage(id)
      .then((result) => { average = result; }),
    getVoteCount(id)
      .then((result) => { count = result; }),
  ])
    .then(() => {
      response.json({
        average,
        count,
      });
    })
    .catch(next);
});

/**
 * Validation chain for the vote value.
 *
 * @type {ValidationChain[]}
 */
const validateVoteValue = [
  param('value').isIn(['1', '2', '3', '4', '5']).withMessage('Parameter must be a value of 1 .. 5'),
];

/**
 * Route middleware: Defines the the POST vote route.
 */
routerVote.post('/:id/:value', validateVoteValue, (request, response, next) => {
  const { id } = request.params;
  const { value } = request.params;
  const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    response.status(406)
      .json({
        error: errors.mapped(),
      });
  }

  addVote(id, value, ip)
    .then(() => getVoteAverage(id))
    .then(average => response.json(average.public()))
    .catch(next);
});
