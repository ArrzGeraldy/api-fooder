const fs = require("fs");
const path = require("path");
const logger = require("./logger");

const deleteImage = (fileName) => {
  const folderPath = path.resolve(process.cwd(), "images");
  const imagePath = path.join(folderPath, fileName);

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return;
    }
    logger.info("File deleted successfully");
  });
};

module.exports = deleteImage;
