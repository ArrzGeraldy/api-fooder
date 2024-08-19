const requireUser = (req, res, next) => {
  const user = req.user;

  if (!user) return res.sendStatus(401);

  return next();
};

const requireAdmin = (req, res, next) => {
  const user = req.user;

  if (!user) return res.sendStatus(401);

  if (user.role !== "admin") res.sendStatus(401);

  return next();
};

module.exports = { requireUser, requireAdmin };
