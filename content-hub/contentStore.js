const nano = require('nano')({ url: 'http://localhost:5984', requestDefaults: { jar: true } });

exports.findAllPosts = async function ({ user, pass }) {
  await nano.auth(user, pass);
  const posts = await nano.db.use('posts').list({include_docs: true});
  return posts.rows.map(r => r.doc);
};