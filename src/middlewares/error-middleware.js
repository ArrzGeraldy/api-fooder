const ResponseError = require("../error/response-error");
const multer = require("multer");

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
  } else if (err instanceof multer.MulterError) {
    console.log(err);
    res
      .status(400)
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
