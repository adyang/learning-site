const nano = require('nano')('http://localhost:5984');

exports.findAllPosts = async function () {
  const posts = await nano.db.use('posts').list({include_docs: true});
  return posts.rows.map(r => r.doc);
};