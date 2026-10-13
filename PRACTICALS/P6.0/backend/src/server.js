const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/{*any}', (req, res) => res.sendFile(path.resolve('public', 'index.html')));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
