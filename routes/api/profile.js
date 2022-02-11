const express = require('express')
const request = require('request')
const config = require('config')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { body, validationResult } = require('express-validator')
/**
 * @route GET api/profile/me
 * @desc  Get current users profile
 * @access Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res.status(400).json({ msg: '此用户没有配置文件' })
    }
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

/**
 * @route POST api/profile
 * @desc  Create or update user profile
 * @access Private
 */
router.post(
  '/',
  [
    auth,
    [
      body('status', 'status是必须的').not().isEmpty(),
      body('skills', 'skills是必须的').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    console.log(JSON.stringify(req.body))
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body

    // 创建profile对象
    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (status) profileFields.status = status
    if (bio) profileFields.bio = bio
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim())
    }
    //创建social对象
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    try {
      let profile = await Profile.findOne({ user: req.user.id })
      if (profile) {
        // 更新
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true },
        )
        return res.json(profile)
      }
      // 创建
      profile = new Profile(profileFields)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  },
)

/**
 * @route GET api/profile
 * @desc  Get all profiles
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

/**
 * @route GET api/profile/user/:user_id
 * @desc  Get profiles by user ID
 * @access Public
 */
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar'])
    if (!profile) return res.status(400).json({ msg: '该用户profile未找到' })
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: '该用户profile未找到' })
    }
    res.status(500).send('Server Error')
  }
})

/**
 * @route DELETE api/profile
 * @desc  Delete profile , user & posts
 * @access Private
 */
router.delete('/', auth, async (req, res) => {
  try {
    // remove users posts
    await this.Post.deleteMany({user:req.user.id})
    // reomve profile
    profiles = await Profile.findOneAndRemove({ user: req.user.id })
    // reomve user
    profiles = await User.findOneAndRemove({ _id: req.user.id })
    res.json({ msg: '用户删除成功' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

/**
 * @route PUT api/profile/experience
 * @desc  Add profile experience
 * @access Private
 */
router.put(
  '/experience',
  [
    auth,
    [
      body('title', 'title是必填项').not().isEmpty(),
      body('company', 'company是必填项').not().isEmpty(),
      body('from', 'from是必填项').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { title, company, location, from, to, current, decription } = req.body

    const newExp = { title, company, location, from, to, current, decription }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.experience.unshift(newExp)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  },
)

/**
 * @route DELETE api/profile/experience/:exp_id
 * @desc  Delete experience from profile
 * @access Private
 */
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id })
    //get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id)
    profile.experience.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

/**
 * @route PUT api/profile/education
 * @desc  Add profile education
 * @access Private
 */
router.put(
  '/education',
  [
    auth,
    [
      body('school', 'school是必填项').not().isEmpty(),
      body('degree', 'degree是必填项').not().isEmpty(),
      body('fieldofstudy', 'fieldofstudy是必填项').not().isEmpty(),
      body('from', 'from是必填项').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      decription,
    } = req.body

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      decription,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.education.unshift(newEdu)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  },
)

/**
 * @route DELETE api/profile/education/:exp_id
 * @desc  Delete education from profile
 * @access Private
 */
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id })
    //get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.exp_id)
    profile.education.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

/**
 * @route GET api/profile/github/:username
 * @desc  GET user repos from github
 * @access Public
 */
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId',
      )}&client_secret=${config.get('githubSecret')}}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    }
    request(options, (error, response, body) => {
      if (error) console.log(error)
      if (response.statusCode != 200) {
        return res.status(404).json({ msg:'没有github profile'})
      }
      res.json(JSON.parse(body))
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
