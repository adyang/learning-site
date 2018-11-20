const express = require('express');
const router = express.Router();
const contentStore = require('./contentStore');

function createRouter({ user, userPass: pass }) {
  router.post('/query', async (req, res) => {
    const posts = await contentStore.findAllPosts({ user, pass });
    res.json(posts);
  });

  return router;
}


module.exports = createRouter;