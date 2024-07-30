const validateAuth = (req, res) => {
  const user = req.user;

  if (user) {
    return res.status(200).json(user);
  }

  res.status(401).json({ message: "user not authenticated" });
};

module.exports = { validateAuth };
