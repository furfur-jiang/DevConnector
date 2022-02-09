const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const config = require('config')
/**
 * @route POST api/users
 * @desc  Register route
 * @access Public
 */
router.post(
  '/',
  [
    //检验输入内容
    body('name', '请输入名字').not().isEmpty(),
    body('email', '请输入正确邮箱').isEmail(),
    body('password', '请输入密码，长度至少为6').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password } = req.body

    try {
      let user = await User.findOne({ email: email })
      //see if user exists
      if (user) {
        return res.status(400).json({ error: [{ msg: '用户已存在' }] })
      }

      //1. get users gravatar 头像唯一标识 TODO:地址无法访问
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })
      
      //2 .形成用户对象
      user = new User({
        name,
        email,
        avatar,
        password,
      })
      //3 encrypt password 把密码加密
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      
      //4 将用户信息存储到数据库
      await user.save() 

      //5 生成jwt并返回
      const payload = {
        user: {
          id: user.id,
        },
      }
      jwt.sign(
        payload,
        config.get('jwtSecret'),//从config文件获取内容
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
