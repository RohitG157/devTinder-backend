const express = require('express');
const { verifyToken } = require('../middlewares/auth/auth');
const User = require('../models/user');
const profileRouter = express.Router();

profileRouter.get('/profile', verifyToken, async (req, res) => {
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

module.exports = profileRouter;
