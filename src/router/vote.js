import express from 'express';
import { param, validationResult } from 'express-validator/check';
import { addVote, getVoteAverage, getVoteCount } from '../lib/vote-persistent';

export const router = express.Router();

/**
 * Defines the GET vote average endpoint.
 */
router.get('/:id', (request, response) => {
  const { id } = request.params;

  getVoteAverage(id)
    .then(average => response.json(average.public()));
  // TODO catch.
});

/**
 * Defines the GET vote statistics route.
 */
router.get('/:id/stats', (request, response) => {
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
    });
  // TODO catch.
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
 * Defines the the POST vote route.
 */
router.post('/:id/:value', validateVoteValue, (request, response) => {
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
    .then(average => response.json(average.public()));
  // TODO catch.
});

export default router;
