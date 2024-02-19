const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("STATUS 200 - Responds with an array of all the topics objects.", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          topics.forEach(({ slug, description }) => {
            expect(typeof slug).toBe("string");
            expect(typeof description).toBe("string");
          });
        });
    });
  });
});
