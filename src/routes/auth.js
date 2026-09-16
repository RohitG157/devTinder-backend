const express = require('express');
const {
  validateSignUpData,
  validateLoginData,
} = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const authRouter = express.Router();

authRouter.post('/signUp', async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const pwdHash = await bcrypt.hash(password, 10);
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

authRouter.post('/login', async (req, res) => {
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
      res.json({ message: 'Login Successfull!!!', data: user });
    }
  } catch (err) {
    res.status(400).send('Error Occurred: ' + err.message);
  }
});

authRouter.post('/logout', (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  });
  res.setHeader('Clear-Site-Data', '"cookies", "storage", "cache"'); // works only on https
  res.json({ message: 'Logout Successfully.' });
});

module.exports = authRouter;
