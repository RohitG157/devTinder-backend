const authMiddleware = (req, res, next) => {
  const token = 'xyz1';
  if (token !== 'xyz') {
    res.status(401).send('You are un-authorized user !!!');
  } else {
    next();
  }
};

module.exports = {
  authMiddleware,
};
