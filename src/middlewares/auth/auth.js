const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
  const token = 'xyz1';
  if (token !== 'xyz') {
    res.status(401).send('You are un-authorized user !!!');
  } else {
    next();
  }
};

const fieldAllowedToUpdate = (req, res, next) => {
  const ALLOWED_UPDATES = ['password', 'photoUrl', 'skills', 'about'];
  const data = req.body;
  const isUpdateAllowed = Object.keys(data).every((k) =>
    ALLOWED_UPDATES.includes(k),
  );
  const isSkillsAreInLimit = data.skills.length < 10;
  if (isUpdateAllowed && isSkillsAreInLimit) {
    next();
  } else {
    res.status(400).send('Invalid Request!!!');
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
    console.log(decodedMsg);
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
