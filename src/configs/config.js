require("dotenv").config();

const config = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  mtClientKey: process.env.MIDTRANS_CLIENT_KEY,
  mtServerKey: process.env.MIDTRANS_SERVER_KEY,
  dbLocal: process.env.DB_LOCAL,
  dbAtlas: process.env.DB_ATLAS,
};

module.exports = config;
