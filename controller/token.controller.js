const jwt = require('jsonwebtoken')

const verifyToken = (req, res) => {
  try {
    const payload = jwt.verify(req.body.token, process.env.JWT_SECRET)
    res.status(200).json(payload)

  } catch (error) {
    res.status(500).json({message: "Invalid token"})
  }
}

module.exports = {
  verifyToken
}