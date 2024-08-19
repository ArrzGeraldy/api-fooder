const ResponseError = require("../error/response-error");

const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        status: false,
        error: {
          message: err.message,
        },
      })
      .end();
  } else {
    res
      .status(500)
      .json({
        status: false,
        error: {
          message: "internal server error",
        },
      })
      .end();
  }
};

module.exports = errorMiddleware;
