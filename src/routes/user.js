const express = require('express');
const { verifyToken } = require('../middlewares/auth/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();

userRouter.get('/user/request/received', verifyToken, async (req, res) => {
  try {
    const userId = req._id;
    const requests = await ConnectionRequestModel.find({
      toUserId: userId,
      status: 'interested',
    }).populate('fromUserId', 'firstName lastName skills gender age');
    res.json({ message: 'Success', data: requests });
  } catch (error) {
    res.status(400).json({ message: `Error Occured: ${error.message}` });
  }
});

userRouter.get('/user/request/connections', verifyToken, async (req, res) => {
  try {
    const loggedInUserId = req._id;

    const connections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUserId, status: 'accepted' },
        { toUserId: loggedInUserId, status: 'accepted' },
      ],
    })
      .populate('fromUserId', 'firstName lastName skills gender age')
      .populate('toUserId', 'firstName lastName skills gender age');
    const data = connections.map((row) => {
      if (row.fromUserId._id.equals(req._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (error) {
    res.status(400).json({ message: `Error Occured: ${error.message}` });
  }
});

userRouter.get('/user/feed', verifyToken, async (req, res) => {
  try {
    const userId = req._id;
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;

    const connections = await ConnectionRequestModel.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    }).select('fromUserId toUserId');

    const hideFromFeed = new Set();
    connections.forEach((request) => {
      hideFromFeed.add(request.fromUserId.toString());
      hideFromFeed.add(request.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideFromFeed) } },
        { _id: { $ne: userId } },
      ],
    })
      .select('firstName lastName skills gender age')
      .skip(skip)
      .limit(limit);
    res.json({ data: users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = userRouter;
