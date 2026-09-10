const express = require('express');

const app = express();
const PORT = 3000;

app.use('/test', (req, res) => {
  res.send('Hello Testing');
});

app.listen(PORT, () => {
  console.log(`Server is successfully created and listening at port ${PORT}`);
});
