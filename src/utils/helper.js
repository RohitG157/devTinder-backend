const isStatusAllowed = (allowedStatus, status) => {
  if (!allowedStatus.includes(status)) {
    return false;
  }
  return true;
};

module.exports = {
  isStatusAllowed,
};
