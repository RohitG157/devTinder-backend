const validator = require('validator');
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error('Name is invalid.');
  }

  if (!validator.isEmail(emailId)) {
    throw new Error('Email is invalid.');
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error('Password is invalid.');
  }
};

const validateLoginData = (req) => {
  const { emailId } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error('Email Id is invalid.');
  }
};

const validatePassword = (req) => {
  const { newPassword } = req.body;
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error('Please enter strong password.');
  }
};

module.exports = {
  validateSignUpData,
  validateLoginData,
  validatePassword,
};
