const express = require('express');
const sleep = require('sleep');

const app = express();

app.get('/test', getTest);

if (!module.parent) {
  app.listen(3000);
}

/**
 * Callback: Return the vote statistics.
 */
function getTest(req, res) {
  asyncWait();
  // syncWait();
  res.json({
    done: 'yes',
  });
}

function syncWait() {
  sleep.sleep(2);
}

function asyncWait() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

