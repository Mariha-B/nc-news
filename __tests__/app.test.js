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
      return request(app)
        .get("/api/not-an-endpoint")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
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

describe("/api/articles", () => {
  describe("GET", () => {
    test("STATUS 200 - Responds with an array of all the article objects sorted by the date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(13);
          articles.forEach(
            ({
              author,
              title,
              article_id,
              topic,
              created_at,
              votes,
              article_img_url,
              comment_count,
            }) => {
              expect(typeof author).toBe("string");
              expect(typeof title).toBe("string");
              expect(typeof article_id).toBe("number");
              expect(typeof topic).toBe("string");
              expect(typeof created_at).toBe("string");
              expect(typeof votes).toBe("number");
              expect(typeof article_img_url).toBe("string");
              expect(typeof comment_count).toBe("number");
            }
          );
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("STATUS 200 - Responds with an array of all the article objects sorted by the date in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(13);
          articles.forEach(
            ({
              author,
              title,
              article_id,
              topic,
              created_at,
              votes,
              article_img_url,
              comment_count,
            }) => {
              expect(typeof author).toBe("string");
              expect(typeof title).toBe("string");
              expect(typeof article_id).toBe("number");
              expect(typeof topic).toBe("string");
              expect(typeof created_at).toBe("string");
              expect(typeof votes).toBe("number");
              expect(typeof article_img_url).toBe("string");
              expect(typeof comment_count).toBe("number");
            }
          );
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("STATUS 400 - Responds with 'Bad Request' when requested with an invalid sort_by query.", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    describe("QUERY ?topic=:topic", () => {
      test("STATUS 200 - Responds with an array of the article objects of the queried topic.", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
            articles.forEach(
              ({
                author,
                title,
                article_id,
                topic,
                created_at,
                votes,
                article_img_url,
                comment_count,
              }) => {
                expect(typeof author).toBe("string");
                expect(typeof title).toBe("string");
                expect(typeof article_id).toBe("number");
                expect(topic).toBe("mitch");
                expect(typeof created_at).toBe("string");
                expect(typeof votes).toBe("number");
                expect(typeof article_img_url).toBe("string");
                expect(typeof comment_count).toBe("number");
              }
            );
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("STATUS 400 - Responds with 'Bad Request' when requested with an invalid topic query.", () => {
        return request(app)
          .get("/api/articles?topic=invalid")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("topic does not exist");
          });
      });
    });
  });
});

describe("/api/articles/:articles_id/comments", () => {
  describe("GET", () => {
    test("STATUS 200 - Responds with an array of all the comments on the given article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(11);
          comments.forEach(
            ({ comment_id, body, article_id, created_at, votes, author }) => {
              expect(typeof comment_id).toBe("number");
              expect(typeof body).toBe("string");
              expect(article_id).toBe(1);
              expect(typeof created_at).toBe("string");
              expect(typeof votes).toBe("number");
              expect(typeof author).toBe("string");
            }
          );
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("STATUS 400 - Responds with bad request with invalid id", () => {
      return request(app)
        .get("/api/articles/not-an-id/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("STATUS 200 - Responds with empty array with valid article_id with no comments", () => {
      return request(app)
        .get("/api/articles/11/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(0);
        });
    });
    test("STATUS 404 - Responds with not found article doesn't exist", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article does not exist");
        });
    });
    test("STATUS 404 - Responds with bad request with invalid endpoint", () => {
      return request(app)
        .get("/api/articles/11/not-comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
  });
  describe("POST", () => {
    test("STATUS 201 - Responds with the newly inserted comment object.", () => {
      const newComment = {
        author: "butter_bridge",
        body: "What are you doing in MA swamp?",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment.comment_id).toEqual(19);
          expect(comment.author).toEqual("butter_bridge");
          expect(comment.body).toEqual("What are you doing in MA swamp?");
          expect(comment.article_id).toEqual(1);
          expect(typeof comment.created_at).toEqual("string");
          expect(comment.votes).toEqual(0);
        });
    });
    test("STATUS 400 - Responds with 'Bad Request' due to sent object missing properties.", () => {
      const newComment = {
        body: "What are you doing in MA swamp?",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("STATUS 200 - Responds with the article object with the updated vote.", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("STATUS 200 - Responds with the article object with the updated vote.", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("STATUS 400 - Responds with 'Bad Request' due to incorrect property type.", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "not-a-number" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("STATUS 400 - Responds with 'Bad Request' due to invalid id.", () => {
    return request(app)
      .patch("/api/articles/not-an-id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("STATUS 404 - Responds with 'article does not exist' due to non-existing article.", () => {
    return request(app)
      .patch("/api/articles/10000")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article does not exist");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("STATUS 204 - Responds with the status code 204.", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("STATUS 404 - Responds with the status code 404 when comment not found.", () => {
    return request(app)
      .delete("/api/comments/10000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("STATUS 400 - Responds with 'Bad Request' due to invalid ID.", () => {
    return request(app)
      .delete("/api/comments/not_a_number")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("STATUS 200 - Responds with an array of all the user objects.", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          users.forEach(({ username, name, avatar_url }) => {
            expect(typeof username).toBe("string");
            expect(typeof name).toBe("string");
            expect(typeof avatar_url).toBe("string");
          });
        });
    });
    test("STATUS 404 - Responds with 404", () => {
      return request(app)
        .get("/api/not-an-endpoint")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
  });
});
