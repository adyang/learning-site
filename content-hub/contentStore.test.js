const nano = require('nano')('http://localhost:5984');
const contentStore = require('./contentStore');

describe('contentStore', () => {
  const POSTS_DB = 'posts';
  let postsDb;

  beforeEach(async () => {
    await destroy(POSTS_DB);
    await nano.db.create(POSTS_DB);
    postsDb = nano.db.use(POSTS_DB);
  });

  async function destroy(dbName) {
    const existingDbs = await nano.db.list();
    if (existingDbs.includes(dbName)) await nano.db.destroy(dbName);
  }

  it('finds all Posts in the database', async () => {
    const posts = [{content: "postContentOne"}, {content: "postContentTwo"}];
    await postsDb.bulk({docs: posts});

    const postsFound = await contentStore.findAllPosts();
    const contentsOfPosts = postsFound.map(({content}) => ({content}));

    expect(contentsOfPosts).toEqual(posts);
  });
});