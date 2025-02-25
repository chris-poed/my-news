const app = require("../app");
const request = require("supertest");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpointsJson = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET 404 Responds with Not Found when endpoint does not exist", () => {
  test("404: Responds with Not Found when endpoint does not exist", () => {
    return request(app)
      .get("/api/invalid-endpoint")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Endpoint not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/article/:article_id", () => {
  test("200: Responds with an article object, with author, title, article id, body, topic, created at, votes, and image url properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: Comment_count property has the correct count of each comment of the passed article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          comment_count: "11",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: Comment_count property returns 0 when no comments are found for the passed article_id", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 7,
          title: "Z",
          topic: "mitch",
          author: "icellusedkars",
          body: "I was hungry.",
          created_at: expect.any(String),
          comment_count: "0",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: Responds with message when given a valid by non-existent article_id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article_id does not exist");
      });
  });
  test("400: Responds with Bad Request when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects with correct properties and sorted by date descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
            article_img_url: expect.any(String),
          });
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
      });
  });
  test("200: Responds with the correct count value for the comment_count property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles[0].comment_count).toEqual("2");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id with the correct properties, sorted by date descending", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Responds with an empty array when given a valid article_id with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
      });
  });
  test("404: Responds with message when given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article_id does not exist");
      });
  });
  test("400: Responds with Bad Request when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Inserts a new comment with username and body properties, and responds with the posted comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Shenanigans",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          author: "icellusedkars",
          body: "Shenanigans",
          article_id: 1,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("404: Responds with message when given a valid but non-existent article_id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Shenanigans",
    };
    return request(app)
      .post("/api/articles/998/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article_id does not exist");
      });
  });
  test("400: Responds with Bad Request when given an invalid article_id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Shenanigans",
    };
    return request(app)
      .post("/api/articles/not-an-article/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: Responds with Invalid Username when username does not exist", () => {
    const newComment = {
      username: "not-a-username",
      body: "Shenanigans",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid username");
      });
  });
  test("422: Responds with Unprocessable Entity when body does not contain correct property keys", () => {
    const newComment = {
      notUser: "icellusedkars",
      notBody: "Shenanigans",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(422)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Unprocessable entity");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Updates the votes property with a new vote count and responds with the updated article", () => {
    const newVoteCount = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVoteCount)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 105,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: Updates the votes property correctly when passed a negative number", () => {
    const newVoteCount = { inc_votes: -42 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVoteCount)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 58,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: Responds with message when given a valid but non-existent article_id", () => {
    const newVoteCount = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/999")
      .send(newVoteCount)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article_id does not exist");
      });
  });
  test("400: Responds with Bad Request when given an invalid article_id", () => {
    const newVoteCount = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/not-an-article")
      .send(newVoteCount)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes comment and provides no response", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("400: Responds with Bad Request when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects with username, name, and avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:sort_by?/:order_by?", () => {
  test("200: Responds with an array of articles sorted by passed query", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
            article_img_url: expect.any(String),
          });
        });
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("200: Responds with an array of articles sorted by passed query and ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order_by=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
            article_img_url: expect.any(String),
          });
        });
        expect(articles).toBeSortedBy("title", { coerce: true });
      });
  });

  test("200: Responds with an array of articles sorted by comment_count and descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
            article_img_url: expect.any(String),
          });
        });
        expect(articles).toBeSortedBy("comment_count", {
          coerce: true,
          descending: true,
        });
      });
  });
  test("200: Responds with array sorted by created_at and ordered by descending as default when no query passed", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
            article_img_url: expect.any(String),
          });
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("400: Responds with Bad Request if passed an invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=not-a-valid-sort")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("400: Responds with Bad Request if passed an invalid order_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at?order_by=not-a-valid-order-by")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:topic?", () => {
  test("200: Responds with array of articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("200: Responds with an empty array if passed a valid topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(0);
      });
  });
  test("404: Responds with Topic Not Found if topic doesnt exist", () => {
    return request(app)
      .get("/api/articles?topic=topic-doesnt-exist")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Topic not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Responds with user object when passed a valid username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("404: Responds with Username Not Found if username doesnt exist", () => {
    return request(app)
      .get("/api/users/not-a-username")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Username not found");
      });
  });
});

describe("PATCH /api/comment/:comment_id", () => {
  test("200: Updates the votes property with a new vote count and responds with the updated comment", () => {
    const newVoteCount = { inc_votes: 4 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVoteCount)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 20,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
        });
      });
  });
  test("200: Updates the votes property correctly when passed a negative number", () => {
    const newVoteCount = { inc_votes: -36 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVoteCount)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: -20,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
        });
      });
  });
  test("404: Responds with message when given a valid but non-existent comment_id", () => {
    const newVoteCount = { inc_votes: 5 };
    return request(app)
      .patch("/api/comments/999")
      .send(newVoteCount)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment_id does not exist");
      });
  });
  test("400: Responds with Bad Request when given an invalid comment_id", () => {
    const newVoteCount = { inc_votes: -36 };
    return request(app)
      .patch("/api/comments/not-a-comment")
      .send(newVoteCount)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});
/* describe.todo("POST /api/articles", () => {
  test.todo("201: Inserts a new article, and responds with the posted article", () => {
    const newArticle = {
        author: "butter_bridge",
        title: "a new article",
        body: "this is a new article body, it has a bit of text, a bit of this, a bit of that.",
        topic: "mitch",
        article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"  
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newArticle)
    .expect(201)
    .then(({ body: { article } }) => {
      expect(article).toMatchObject({
        article_id: expect.any(Number),
        author: "butter_bridge",
        title: "a new article",
        body: "this is a new article body, it has a bit of text, a bit of this, a bit of that.",
        topic: "mitch",
        article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        votes: expect.any(Number),
        created_at: expect.any(String),
        comment_count: expect.any(Number)
      })
    })
  })
}) */
