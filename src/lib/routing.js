import { param, validationResult } from 'express-validator/check';
import { addVote, getVoteAverage, getVoteCount } from './vote-persistent';

/**
 * Callback: Return the vote average.
 */
export function getAverage(request, response) {
  const { id } = request.params;

  getVoteAverage(id)
    .then(average => response.json(average.public()));
  // TODO catch.
}

/**
 * Callback: Return the vote statistics.
 */
export function getStatistics(request, response) {
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
}

/**
 * Validation chain for postVote.
 *
 * @type {ValidationChain[]}
 */
export const postVoteValidation = [
  param('value').isIn(['1', '2', '3', '4', '5']).withMessage('Parameter must be a value of 1 .. 5'),
];

/**
 * Callback: Store vote data.
 */
export async function postVote(request, response) {
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
}
