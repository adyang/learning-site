const express = require('express');
const router = express.Router();
const contentStore = require('./contentStore');

router.post('/query', async (req, res) => {
  const posts = await contentStore.findAllPosts();
  res.json(posts);
});

module.exports = router;