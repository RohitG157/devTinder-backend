const express = require('express');

const app = express();
const PORT = 7777;
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

connectDB()
  .then(() => {
    console.log('DB connected Successfully');
    app.listen(PORT, () => {
      console.log(
        `Server is successfully created and listening at port ${PORT}`,
      );
    });
  })
  .catch((err) => {
    console.log('Error Occured!', err);
  });
