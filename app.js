/**
 * @file
 * TODO
 */

const logger = require('koa-logger');
const router = require('koa-router')();
const Koa = require('koa');

const app = module.exports = new Koa();

// Vote storage
// TODO Use a more persistent storage.
let votes = [];

// Middle ware.
app.use(logger());
router.post('/vote/:id/:value', vote)
  .get('/vote/:id', average);
app.use(router.routes());

/**
 * Callback: Return the average of votes.
 */
async function average(ctx) {
  const id = ctx.params.id;
  let avg;
  let count;

  [avg, count] = calculateAverage(id);

  // ctx.statusCode = 200;
  ctx.body = {
    average: avg,
    count,
  };
}

/**
 * Callback: Store vote data.
 */
async function vote(ctx) {
  const id = ctx.params.id;
  const value = ctx.params.value;

  // TODO Validate id, value.

  addVote(id, value);

  ctx.body = '';
}

/**
 * Convert a value to integer.
 *
 * @param value
 *   The value to be converted.
 * @returns int
 *   The integer value. 0 if the value is zero or not a number.
 */
function intValue(value) {
  const int = parseInt(value, 10);
  return int || 0;
}

/**
 * TODO
 *
 * @param id
 * @param value
 */
function addVote(id, value) {
  const iValue = intValue(value);
  if (!iValue) {
    return;
  }

  votes.push({
    id,
    value: iValue,
    timestamp: new Date().getTime(),
  });
}

/**
 * TODO
 *
 * @param id
 * @returns {number[]}
 */
function calculateAverage(id) {
  let total = 0;
  let count = 0;
  let result = 0;

  // TODO Use a more scalable solution.
  votes.forEach((item) => {
    if (item.id === id) {
      total += item.value;
      count += 1;
    }
  });

  if (count) {
    result = total / count;
  }
  result = Number((result).toFixed(1));

  return [result, count];
}

// listen
if (!module.parent) app.listen(3000);
