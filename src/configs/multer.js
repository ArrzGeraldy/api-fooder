const multer = require("multer");
const mime = require("mime-types");

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(mime.lookup(file.originalname))) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new multer.MulterError(
        "MIME TYPES",
        "Only images (.jpg, .jpeg, .png, .webp) are allowed!"
      )
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1048576,
  },
});

module.exports = upload;
