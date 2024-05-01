const responseError = (res, status_code, message, status = false) => {
  return res.status(status_code).send({ status, error: { message } });
};

module.exports = {
  responseError,
};
