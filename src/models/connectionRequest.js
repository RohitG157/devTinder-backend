const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'Users',
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'Users',
    },
    status: {
      type: String,
      enum: {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is not supported`,
      },
    },
  },
  {
    timestamps: true,
  },
);

// connectionRequestSchema.pre('save', async function (next) {
//   const connectionReq = this;
//   console.log(this);
//   if (connectionReq.fromUserId.equals(connectionReq.toUserId)) {
//     throw new Error('Bad Request: Cannot send the request to yourself.');
//   }
//   next();
// });

const ConnectionRequestModel = mongoose.model(
  'connectionRequest',
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
