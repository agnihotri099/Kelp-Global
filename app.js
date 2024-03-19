const express = require('express');
const { pool } = require('./config/dbConfig');
const indexRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
