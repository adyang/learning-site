const nano = require('nano')({ url: 'http://localhost:5984', requestDefaults: { jar: true } });
const dbConfig = require('config').get('couchDb');
const pageUrl = `http://localhost:${process.env.CI ? 5000 : 3000}`;
let testDb;

beforeEach(async () => {
  await nano.auth(dbConfig.admin, dbConfig.adminPass);
  await destroy('posts');
  await nano.db.create('posts');
  testDb = nano.use('posts');
  await testDb.insert({
    admins: { names: [], roles: [] },
    members: { names: [""], roles: ["learning-site"] }
  }, '_security');
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
    await insertIntoContentStore({ content: "TIL Content" });

    await page.goto(pageUrl);

    await expect(page).toMatch('TIL Content');
  });

  it('should show TIL last edited date and category', async () => {
    const content = "# Title\n```\nTIL Code\n```\n";
    await insertIntoContentStore(
      { content, category: "category", lastEditedDate: "2018-11-11" });

    await page.goto(pageUrl);

    await showsElementOnPage('.content h1', 'Title');
    await showsElementOnPage('.content code', 'TIL Code');
    await showsElementOnPage(".category", "category");
    await showsElementOnPage(".last-edited", "2018-11-11");
  });

  it('should show multiple TIL contents on page', async () => {
    const contentOne = "# Title1\n```\nCode1\n```\n";
    await insertIntoContentStore(
      { id: "id1", content: contentOne, category: "category1", lastEditedDate: "2018-11-11" });
    const contentTwo = "# Title2\n```\nCode2\n```\n";
    await insertIntoContentStore(
      { id: "id2", content: contentTwo, category: "category2", lastEditedDate: "2018-11-12" });

    await page.goto(pageUrl);

    await showsElementsOnPageWithTexts('.content h1', ['Title1', 'Title2']);
    await showsElementsOnPageWithTexts('.content code', ['Code1', 'Code2']);
    await showsElementsOnPageWithTexts('.category', ['category1', 'category2']);
    await showsElementsOnPageWithTexts('.last-edited', ['2018-11-11', '2018-11-12']);
  });

  async function insertIntoContentStore(post) {
    await testDb.insert(post);
  }

  async function showsElementOnPage(selector, text) {
    await showsElementsOnPageWithTexts(selector, [text]);
  }

  async function showsElementsOnPageWithTexts(selector, expectedTexts) {
    await expect(page).toMatchElement(selector);
    const texts = await page.$$eval(selector, elems => elems.map(e => e.textContent));
    expect(texts).toEqual(expectedTexts);
  }
});