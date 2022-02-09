const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')
/**
 * @route POST api/posts
 * @desc  Test route
 * @access Public
 */
router.post(
  '/',
  [auth, [body('text', '请输入内容').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select('-password')
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      })
      const post = await newPost.save()
      res.json(post)
    } catch (err) {
      console.error(err.message)
      res.status(500).end('Server Error')
    }
  },
)

/**
 * @route GET api/posts
 * @desc  Get all posts
 * @access Private
 */

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).end('Server Error')
  }
})

/**
 * @route GET api/posts
 * @desc  Get  posts by id
 * @access Private
 */

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.json(post)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).end('Server Error')
  }
})

/**
 * @route DELETE api/posts
 * @desc  Delete post by id
 * @access Private
 */

router.delete('/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id)

    //checke user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: '用户没有权限' })
    }
    await post.remove()
    res.json({ msg: 'Post removed' })
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).end('Server Error')
  }
})

/**
 * @route PUT api/post/like/:id
 * @desc  Like a post
 * @access Private
 */

router.put('/like/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id)
    //判断是否已收藏
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Posts 已经收藏' })
    }
    post.likes.unshift({ user: req.user.id })
    await post.save()
    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).end('Server Error')
  }
})

/**
 * @route PUT api/post/unlike/:id
 * @desc  Unlike a post
 * @access Private
 */

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id)
    //判断是否已收藏
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Posts 未收藏' })
    }
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)
    post.likes.splice(removeIndex, 1)
    await post.save()
    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).end('Server Error')
  }
})

/**
 * @route POST api/posts/comment/:id
 * @desc  Add comment on a post
 * @access Private
 */
router.post(
  '/comment/:id',
  [auth, [body('text', '请输入内容').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select('-password')
      const post = await Post.findById(req.params.id)
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      }
      post.comments.unshift(newComment)
      await post.save()
      res.json(post.comments)
    } catch (err) {
      console.error(err.message)
      res.status(500).end('Server Error')
    }
  },
)

/**
 * @route DELETE api/posts/comment/:id/:comment_id
 * @desc  Delete comment
 * @access Private
 */
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //取出comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id,
    )
    if (!comment) {
      return res.status(404).json({ msg: 'comment 不存在' })
    }
    //检查用户
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: '用户没有权限' })
    }
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id)
    post.comments.splice(removeIndex, 1)
    await post.save()
    res.json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).end('Server Error')
  }
})

module.exports = router
