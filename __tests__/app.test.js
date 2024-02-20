const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");
const utils = require("../db/seeds/utils.js");

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
  });
});

describe("/api", () => {
  test("STATUS 200 - Responds with an object describing available endpoints on api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("STATUS 200 - Responds with an article object of article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.author).toBe("butter_bridge");
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.article_id).toBe(1);
          expect(article.body).toBe("I find this existence challenging");
          expect(article.topic).toBe("mitch");
          expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(article.votes).toBe(100);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("STATUS 404 - Responds with not found when given a valid but non-existing id", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article does not exist");
        });
    });
    test("STATUS 400 - Responds with bad request when given an invalid id", () => {
      return request(app)
        .get("/api/articles/no-an-id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
});
