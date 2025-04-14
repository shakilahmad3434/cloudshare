const jwt = require('jsonwebtoken')
const AuthMiddleware = (req, res, next) => {
  try {
    const {authorization} = req.headers

    if(!authorization)
      return res.status(401).json({message: "Invalid Request"})

    const [type, token] = authorization.split(" ")
    console.log(token)

    if(type !== "Bearer")
      return res.status(401).json({message: "Invalid Request"})

    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user

    next()

  } catch (err) {
    res.status(401).json({message: 'Invalid Request'})
  }
}

module.exports = AuthMiddleware