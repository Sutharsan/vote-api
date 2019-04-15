/**
 * @file
 * TODO
 */

const logger = require('koa-logger');
const router = require('koa-router')();
const Koa = require('koa');

// eslint doesn't like multiline assignment. its better to seperate them.
// https://eslint.org/docs/rules/no-multi-assign
let app = module.exports;
app = new Koa();

// Vote storage
// TODO Use a more persistent storage.
const votes = [];

// Middle ware.
app.use(logger());
router.post('/vote/:id/:value', vote)
  .get('/vote/:id', average);
app.use(router.routes());

/**
 * Callback: Return the average of votes.
 */
async function average(ctx) {
  const { id } = ctx.params;
  // TODO Validate id, value. Throw exception when invalid.

  // TODO Try/catch with error response.
  // eslint doesn't like an array as definition. Its better to use a ambiguous var/let/const
  const calcAvg = calculateAverage(id);

  // ctx.statusCode = 200;
  ctx.body = {
    // the 'average' and 'count' variables broke when removing the definitions. i changed them into objects
    average: calcAvg.result,
    count: calcAvg.count,
  };
}

/**
 * Callback: Store vote data.
 */
async function vote(ctx) {
  const { id } = ctx.params;
  const { value } = ctx.params;

  // TODO Validate id, value. Throw exception when invalid.

  // TODO Try/catch with error response.
  addVote(id, value);

  // TODO Return ::average() result.
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
    // TODO Throw exception with reason.
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

  return { result, count };
}

// listen
if (!module.parent) app.listen(3000);
