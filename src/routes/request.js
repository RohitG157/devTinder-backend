const express = require('express');
const { verifyToken } = require('../middlewares/auth/auth');

const requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest', verifyToken, (req, res) => {
  try {
    res.send('Connection Request Sent Successfully.');
  } catch (error) {
    res.status(400).send('Error Occured: ' + error.message);
  }
});

module.exports = requestRouter;
