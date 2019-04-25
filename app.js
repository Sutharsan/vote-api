const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

if (!module.parent) {
  app.listen(3000);
}
