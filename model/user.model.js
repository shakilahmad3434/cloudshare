const {Schema, model} = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  image: {
    type: String
  },
  fullname: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid Email Address"
    ]
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  storageUsed: {
    type: Number,
    default: 0
  },
  storageLimit: {
    type: Number,
    default: 10737418240
  },
}, {timestamps: true})

userSchema.pre('save', async function(next){
  const count = await model('User').countDocuments({mobile: this.mobile})
  
  if(count > 0)
    throw next( new Error('Mobile Number Already Exists!'))

  next()
})

userSchema.pre('save', async function(next){
  const count = await model('User').countDocuments({email: this.email})

  if(count > 0)
    throw next(new Error('Email address Already Exists!'))

  next()
})

userSchema.pre('save', async function(next) {
  const encryptedPassword = await bcrypt.hash(this.password.toString(), 12)
  this.password = encryptedPassword

  next()
})

const UserModel = model('User', userSchema)

module.exports = UserModel