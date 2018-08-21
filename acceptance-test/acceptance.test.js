const nano = require('nano')('http://localhost:5984');
let testDb;

beforeEach(async () => {
  await destroy('posts');
  await nano.db.create('posts');
  testDb = nano.use('posts');
});

async function destroy(dbName) {
  try {
    await nano.db.destroy(dbName);
  } catch (error) {
    if (!error.message.includes("Database does not exist"))
      throw error;
  }
}

describe('Acceptance Test Criteria', () => {
  it('should show single TIL content on page', async () => {
    await insertIntoContentStore("TIL Content");
    await showsContentOnPage("TIL Content");
  });

  async function insertIntoContentStore(content) {
    await testDb.insert({content: content});
  }

  async function showsContentOnPage(expected) {
    await page.goto('http://localhost:3000');
    await expect(page).toMatch(expected);
  }
});