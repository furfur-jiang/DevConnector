const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const { body, validationResult } = require('express-validator')
const config = require('config')
const bcrypt = require('bcryptjs')
/**
 * @route GET api/auth
 * @desc  Test route
 * @access Public
 */
// 加auth中间件
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

/**
 * @route POST api/users
 * @desc  authenticated  & get token  (user经过身份验证的用户)
 * @access Public
 */
router.post(
  '/',
  [
    //检验输入内容
    body('email', '请输入正确邮箱').isEmail(),
    body('password', '请输入密码').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body

    try {
      let user = await User.findOne({ email: email })
      if (!user) {
        return res.status(400).json({ error: [{ msg: 'Invalid Credentials 没有登录资格' }] })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      
      if (!isMatch) {
        return res.status(400).json({ error: [{ msg: 'Invalid Credentials 没有登录资格' }] })
      }

      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'), //从config文件获取内容
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        },
      )
      //return jwt
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  },
)

module.exports = router
