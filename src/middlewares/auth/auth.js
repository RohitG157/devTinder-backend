const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
  const token = 'xyz1';
  if (token !== 'xyz') {
    res.status(401).send('You are un-authorized user !!!');
  } else {
    next();
  }
};

const fieldAllowedToUpdate = (req) => {
  const ALLOWED_UPDATES = ['photoUrl', 'skills', 'about', 'gender'];
  const data = req.body;
  const isUpdateAllowed = Object.keys(data).every((k) =>
    ALLOWED_UPDATES.includes(k),
  );
  let isSkillsAreInLimit = false;
  if (data.skills) {
    isSkillsAreInLimit = data?.skills.length < 10;
  } else {
    isSkillsAreInLimit = true;
  }

  if (!isUpdateAllowed || !isSkillsAreInLimit) {
    throw new Error('Invalid Edit Request.');
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      console.log(token);
      throw new Error('Invalid Token...');
    }
    const decodedMsg = await jwt.verify(token, 'DevTinder@5107$');
    const { _id } = decodedMsg;
    req._id = _id;
    next();
  } catch (error) {
    res.status(400).send('Error Occured: ' + error.message);
  }
};

module.exports = {
  authMiddleware,
  fieldAllowedToUpdate,
  verifyToken,
};
