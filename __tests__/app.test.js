const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json")

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
    test("STATUS 404 - Responds with 404", () => {
      return request(app).get("/api/not-an-endpoint").expect(404);
    });
    test("Responds with an object describing available endpoints on api", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
          expect(body).toEqual(endpoints);
        });
    });
  });
});
