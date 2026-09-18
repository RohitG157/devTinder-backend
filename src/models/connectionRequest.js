const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['ignored', 'interested'],
        message: `{VALUE} is not supported`,
      },
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.pre('save', async function (next) {
  const connectionReq = this;
  if (connectionReq.fromUserId.equals(connectionReq.toUserId)) {
    throw new Error('Bad Request: Cannot send the request to yourself.');
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  'connectionRequest',
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
