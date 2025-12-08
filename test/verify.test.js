const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the index.js file', () => {
  it('should list all of the todo items in alphabetical order (A to Z)', async function() {
    const todoCards = await page.$$eval('#todo-cards > .card', (results) => results );
    expect(todoCards.length).toBe(3);

    const firstCard = await page.$$eval('#todo-cards > .card', (results) => {
      return results[0].innerHTML;
    });
    expect(firstCard).toContain('make my bed');
    
    const secondCard = await page.$$eval('#todo-cards > .card', (results) => {
      return results[1].innerHTML;
    });
    expect(secondCard).toContain('pack spikes for track meet');

    const thirdCard = await page.$$eval('#todo-cards > .card', (results) => {
      return results[2].innerHTML;
    });
    expect(thirdCard).toContain('walk the dog');
  });

  it('should list all of the doing items in alphabetical order (A to Z)', async function() {
    const doingCards = await page.$$eval('#doing-cards > .card', (results) => results );
    expect(doingCards.length).toBe(2);

    const firstCard = await page.$$eval('#doing-cards > .card', (results) => {
      return results[0].innerHTML;
    });
    expect(firstCard).toContain('sanding art project');
    
    const secondCard = await page.$$eval('#doing-cards > .card', (results) => {
      return results[1].innerHTML;
    });
    expect(secondCard).toContain('write draft english paper');
  });

  it('should list all of the done items in alphabetical order (A to Z)', async function() {
    const doneCards = await page.$$eval('#done-cards > .card', (results) => results );
    expect(doneCards.length).toBe(3);

    const firstCard = await page.$$eval('#done-cards > .card', (results) => {
      return results[0].innerHTML;
    });
    expect(firstCard).toContain('finish math homework');
    
    const secondCard = await page.$$eval('#done-cards > .card', (results) => {
      return results[1].innerHTML;
    });
    expect(secondCard).toContain('practice my trumpet');

    const thirdCard = await page.$$eval('#done-cards > .card', (results) => {
      return results[2].innerHTML;
    });
    expect(thirdCard).toContain('wash the dishes');
  });
});
