const express = require('express');
const app = express();

app.use(express.static('content'));
app.use(express.static('html'));
app.use('/.gitbook', express.static('assets/.gitbook'));
app.use('/assets', express.static('assets'));

const server = app.listen(3001, () => {
  console.log('➡ http://localhost:3001/all.html');
});
