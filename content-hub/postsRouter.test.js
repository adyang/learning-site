overwriteNodeConfigForTest();
const request = require('supertest');
const app = require('./app');
const contentStore = require('./contentStore');

jest.mock('./contentStore');

function overwriteNodeConfigForTest() {
  process.env.NODE_CONFIG = JSON.stringify({
    couchDb: {
      user: 'user',
      userPass: 'userPass'
    }
  });
}

describe('/posts', () => {
  it('responds with all Posts on POST to /query', () => {
    const posts = [{content: "postContentOne"}, {content: "postContentTwo"}];
    contentStore.findAllPosts
      .mockImplementation(() => Promise.resolve(posts))
      .mockName('contentStore.findAllPosts');

    return request(app)
      .post('/posts/query')
      .expect(200, posts)
      .then(() => {
        expect(contentStore.findAllPosts)
          .toHaveBeenCalledWith({ user: 'user', pass: 'userPass' });
      });
  });
});
