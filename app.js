const express = require('express');

const app = express();

// Vote storage
// TODO Use a more persistent storage.
const votes = [];

// Middle ware.
app.get('/vote/:id', getAverage);
app.post('/vote/:id/:value', postVote);

/**
 * Callback: Return the average of votes.
 */
async function getAverage(req, res) {
  // TODO Add param validation
  const { id } = req.params;

  const calculatedAvg = calculateAverage(id);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    average: calculatedAvg.average,
    count: calculatedAvg.count,
  }));
}

/**
 * Callback: Store vote data.
 */
async function postVote(req, res) {
  // TODO Add param validation
  const { id } = req.params;
  const { value } = req.params;

  addVote(id, intValue(value));

  // res.setHeader('Content-Type', 'application/json');
  res.send('');
}

/**
 * Object that contains the calculated average of a voted object.
 *
 * @param average
 *   The average vote.
 * @param count
 *   The total number of votes.
 *
 * @see calculateAverage()
 */
function AverageVote(average, count) {
  this.average = average;
  this.count = count;
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
  votes.push({
    id,
    value,
    timestamp: new Date().getTime(),
  });
}

/**
 * TODO
 *
 * @param id
 * @returns {AverageVote}
 */
function calculateAverage(id) {
  let total = 0;
  let count = 0;
  let average = 0;

  // TODO Use a more scalable solution.
  votes.forEach((item) => {
    if (item.id === id) {
      total += item.value;
      count += 1;
    }
  });

  if (count) {
    average = total / count;
  }
  average = Number((average).toFixed(1));

  return new AverageVote(average, count);
}

if (!module.parent) {
  app.listen(3000);
}
