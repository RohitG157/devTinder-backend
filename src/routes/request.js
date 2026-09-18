const express = require('express');
const { verifyToken } = require('../middlewares/auth/auth');
const User = require('../models/user');
const ConnectionRequestModel = require('../models/connectionRequest');
const { isStatusAllowed } = require('../utils/helper');
const { ALLOWED_REVIEW_STATUS } = require('../common/constant');

const requestRouter = express.Router();

requestRouter.post(
  '/request/send/:status/:userId',
  verifyToken,
  async (req, res) => {
    try {
      const status = req.params?.status;
      const allowedStatus = ['ignored', 'interested'];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: 'Bad Request: Invalid status.' });
      }
      const toUserId = req.params?.userId;
      const fromUserId = req._id;
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res
          .status(400)
          .json({ message: 'Bad Request: User not found.' });
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: 'Bad Request: Check the already sent requests.' });
      }

      const newConnectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      await newConnectionRequest.save();
      res.json({
        message: 'Connection request sent successfully.',
        data: newConnectionRequest,
      });
    } catch (error) {
      res.status(400).json({ message: 'Error Occured: ' + error.message });
    }
  },
);

requestRouter.post(
  '/request/review/:status/:requestId',
  verifyToken,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      if (!status || !requestId) {
        return res.json({ message: 'Connection Request is Invalid.' });
      }

      const isStatusValid = isStatusAllowed(ALLOWED_REVIEW_STATUS, status);
      if (!isStatusValid) {
        return res
          .status(400)
          .json({ message: 'Bad Request: Status is not allowed.' });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: req._id,
        status: 'interested',
      });
      console.log(connectionRequest);
      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: 'Bad Request: Request does not exist.' });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: `Connection request is ${status}.`, data });
    } catch (error) {
      res.status(400).json({ message: `Error Occured: ${error.message}` });
    }
  },
);

module.exports = requestRouter;
