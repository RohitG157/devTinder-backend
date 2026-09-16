const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid.');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate(value) {
        const pwdRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!pwdRegex.test(value)) {
          throw new Error('Password is invalid.');
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (['male', 'female', 'others'].includes(value)) {
          throw new Error('Gender is not valid.');
        }
      },
    },
    photoUrl: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default:
        'This is generic description of this user that is created by the system.',
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, 'DevTinder@5107$', {
    expiresIn: '1h',
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isValidPassword = await bcrypt.compare(
    passwordInputByUser,
    user.password, // DB PASSWORD
  );
  return isValidPassword;
};

module.exports = mongoose.model('Users', userSchema);
