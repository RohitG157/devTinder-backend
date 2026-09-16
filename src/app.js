const express = require('express');

const app = express();
const PORT = 7777;
const connectDB = require('./config/database');
const User = require('./models/user');
const {
  fieldAllowedToUpdate,
  verifyToken,
} = require('./middlewares/auth/auth');
const { validateSignUpData, validateLoginData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
app.use(express.json(), cookieParser());

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

app.get('/feed', verifyToken, async (req, res) => {
  try {
    const users = await User.find({});
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
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const pwdHash = await bcrypt.hash(password, 10);
    console.log(pwdHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: pwdHash,
    });
    await user.save();
    res.send('User created successfully.');
  } catch (err) {
    res.status(400).send('Error Occurred: ' + err.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    validateLoginData(req);

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('Please enter valid credentials.');
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error('Please enter valid credentials.');
    } else {
      const token = await user.getJWT();
      res.cookie('token', token, {
        expires: new Date(Date.now() + 1 * 3600000), // Expires in 1 hour
      });
      res.send('Login Successfull!!!');
    }
  } catch (err) {
    res.status(400).send('Error Occurred: ' + err.message);
  }
});

app.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req._id);
    if (!user) {
      throw new Error('Invalid Request...');
    }
    res.send(user);
  } catch (error) {
    res.status(400).send('Error Occured ' + error.message);
  }
});

app.delete('/user', verifyToken, async (req, res) => {
  try {
    const userId = req.body.userId;
    // await User.findByIdAndDelete({ _id: userId });
    await User.findByIdAndDelete(userId);
    res.send('User Deleted Successfully.');
  } catch (err) {
    res.status(400).send('Error Occured ' + err.message);
  }
});

app.patch(
  '/user/:userId',
  verifyToken,
  fieldAllowedToUpdate,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const data = req.body;
      if (data?.password) {
        const pwdHash = await bcrypt.hash(data.password, 10);
        console.log(pwdHash);
        data.password = pwdHash;
      }
      const user = await User.findByIdAndUpdate(userId, data, {
        returnDocument: 'after',
        runValidators: true,
      });

      res.send(user);
    } catch (err) {
      res.status(400).send('Unexpected Error Occured ' + err.message);
    }
  },
);

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
