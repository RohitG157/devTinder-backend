const express = require('express');

const app = express();
const PORT = 7777;
const connectDB = require('./config/database');
const User = require('./models/user');
app.use(express.json());

app.get('/user', async (req, res) => {
  const user = await User.findOne(req.body);
  try {
    if (!user) {
      res.status(404).send('User not found.');
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send('Error Occurred - ' + err.message);
  }
});

app.get('/feed', async (req, res) => {
  const users = await User.find({});

  try {
    if (users.length) {
      res.send(users);
    } else {
      res.status(404).send('No user found.');
    }
  } catch (err) {
    res.status(400).send('Unexpected Error Occured ' + err.message);
  }
});

app.post('/signUp', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send('User created successfully.');
  } catch (err) {
    res.status(400).send('Error Occurred: ', err.message);
  }
});

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
