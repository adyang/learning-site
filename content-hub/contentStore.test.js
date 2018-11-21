const nano = require('nano')({ url: 'http://localhost:5984', requestDefaults: { jar: true } });
const dbConfig = require('config').get('couchDb');
const contentStore = require('./contentStore');

describe('contentStore', () => {
  const POSTS_DB = 'posts';
  let postsDb;

  beforeEach(async () => {
    await nano.auth(dbConfig.admin, dbConfig.adminPass);
    await destroy(POSTS_DB);
    await nano.db.create(POSTS_DB);
    postsDb = nano.db.use(POSTS_DB);
    await postsDb.insert({
      admins: { names: [], roles: [] },
      members: { names: [""], roles: ["learning-site"] }
    }, '_security');
  });

  async function destroy(dbName) {
    const existingDbs = await nano.db.list();
    if (existingDbs.includes(dbName)) await nano.db.destroy(dbName);
  }

  it('finds all Posts in the database', async () => {
    const posts = [{content: "postContentOne"}, {content: "postContentTwo"}];
    await postsDb.bulk({docs: posts});

    const postsFound = await contentStore.findAllPosts({user: dbConfig.user, pass: dbConfig.userPass});
    const contentsOfPosts = postsFound.map(({content}) => ({content}));

    expect(contentsOfPosts).toEqual(posts);
  });
});