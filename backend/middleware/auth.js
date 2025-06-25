const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "You must login to give a review" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded',decoded)
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = auth;
