import { param, validationResult } from 'express-validator/check';
import { addVote, getVoteAverage, getVoteCount } from './vote-persistent';

/**
 * Callback: Return the vote average.
 */
export async function getAverage(req, res) {
  const { id } = req.params;

  res.json(await getVoteAverage(id));
}

/**
 * Callback: Return the vote statistics.
 */
export async function getStatistics(req, res) {
  const { id } = req.params;

  res.json({
    average: await getVoteAverage(id),
    count: await getVoteCount(id),
  });
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
export async function postVote(req, res) {
  const { id } = req.params;
  const { value } = req.params;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(406).json({
        error: errors.mapped(),
      });
    }

    await addVote(id, value, ip);
    res.json(await getVoteAverage(id));
  } catch (err) {
    // TODO Additional error handling.
  }
}
