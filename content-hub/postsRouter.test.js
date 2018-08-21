const request = require('supertest');
const app = require('./app');
const contentStore = require('./contentStore');

jest.mock('./contentStore');

describe('/posts', () => {
  it('responds with all Posts on POST to /query', () => {
    const posts = [{content: "postContentOne"}, {content: "postContentTwo"}];
    contentStore.findAllPosts.mockImplementation(() => Promise.resolve(posts));

    return request(app)
      .post('/posts/query')
      .expect(200, posts);
  });
});