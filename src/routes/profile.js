const express = require('express');
const {
  verifyToken,
  fieldAllowedToUpdate,
} = require('../middlewares/auth/auth');
const User = require('../models/user');
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const { validatePassword } = require('../utils/validation');

profileRouter.get('/profile/view', verifyToken, async (req, res) => {
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

profileRouter.patch('/profile/edit', verifyToken, async (req, res) => {
  try {
    fieldAllowedToUpdate(req);
    const user = await User.findById(req._id);
    if (!user) {
      throw new Error('User not found.');
    }
    Object.keys(req.body).every((k) => (user[k] = req.body[k]));
    await user.save();
    res.json({ message: 'User information updated successfully.', data: user });
  } catch (error) {
    res.status(400).json({ message: `Error Occured: ${error.message}` });
  }
});

profileRouter.patch('/profile/password', verifyToken, async (req, res) => {
  try {
    validatePassword(req);
    const user = await User.findById(req._id);
    if (!user) {
      throw new Error('User not found.');
    }
    const { oldPassword, newPassword } = req.body;
    const isValidPassword = await user.validatePassword(oldPassword);
    if (!isValidPassword) {
      throw new Error('Invalid Password.');
    }
    const pwdHash = await bcrypt.hash(newPassword, 10);
    user.password = pwdHash;
    await user.save();
    res.json({
      message: 'Password has been updated successfully.',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: `Error Occured: ${error.message}`,
    });
  }
});

module.exports = profileRouter;
