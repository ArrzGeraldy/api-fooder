const { accessTokenSecret } = require("../configs/config");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) return next();

  jwt.verify(accessToken, accessTokenSecret, (err, decoded) => {
    if (err) return res.sendStatus(403);

    req.user = decoded;

    return next();
  });
};

module.exports = verifyToken;
