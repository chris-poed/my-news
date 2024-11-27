const app = require("../app")
const request = require("supertest")
const data = require("../db/data/test-data/index")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const endpointsJson = require("../endpoints.json");

beforeEach(() => {
  return seed(data)
})

afterAll(() => {
  return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
})

describe("GET 404 Responds with Not Found when endpoint does not exist", () => {
  test("404: Responds with Not Found when endpoint does not exist", () => {
    return request(app)
    .get("/api/invalid-endpoint")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Endpoint not found")
    })
  })
})

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3)
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string")
          expect(typeof topic.description).toBe("string")
        })
      })
  })
})

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
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      })
    })
  })
  test("404: Responds with message when given a valid by non-existent article_id", () => {
    return request(app)
    .get("/api/articles/999")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Article_id does not exist")
    })
  })
  test ("400: Responds with Bad Request when given an invalid article_id", () => {
    return request(app)
    .get("/api/articles/not-an-article")
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad request")
    })
  })
})

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects with correct properties and sorted by date descending", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles.length).toBe(13)
      articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String),
          article_img_url:expect.any(String)
        })
        expect(articles).toBeSortedBy("created_at", { descending: true })
      })
    })
  })
  test("200: Responds with the correct count value for the comment_count property", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles[0].comment_count).toEqual("2")
    })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id with the correct properties, sorted by date descending", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body: { comments } }) => {
      expect(comments.length).toBe(11)
      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 1
        })
        expect(comments).toBeSortedBy("created_at", { descending: true })
      })
    })
  })
  test("200: Responds with an empty array when given a valid article_id with no comments", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({ body: { comments } }) => {
      expect(comments.length).toBe(0)
    })
  })
  test("404: Responds with message when given a valid but non-existent article_id", () => {
    return request(app)
    .get("/api/articles/999/comments")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Article_id does not exist")
    })
  })
  test("400: Responds with Bad Request when given an invalid article_id", () => {
    return request(app)
    .get("/api/articles/not-an-article/comments")
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad request")
    })
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Inserts a new comment with username and body properties, and responds with the posted comment", () => {
    const newComment = {
      user: "icellusedkars",
      body: "Shenanigans" 
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(201)
    .then(({ body: { comment } }) => {
      expect(comment).toMatchObject({
        author: "icellusedkars",
        body: "Shenanigans" ,
        article_id: 1,
        votes: 0,
        created_at: expect.any(String)
      })
    })
  })
  test("404: Responds with message when given a valid but non-existent article_id", () => {
    const newComment = {
      user: "icellusedkars",
      body: "Shenanigans" 
    }
    return request(app)
    .post("/api/articles/998/comments")
    .send(newComment)
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Article_id does not exist")
    })
  })
  test("400: Responds with Bad Request when given an invalid article_id", () => {
    const newComment = {
      user: "icellusedkars",
      body: "Shenanigans" 
    }
    return request(app)
    .post("/api/articles/not-an-article/comments")
    .send(newComment)
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad request")
    })
  })
})

describe("PATCH /api/articles/:article_id", () => {
  test("200: Updates the votes property with a new vote count and responds with the updated article", () => {
    const newVoteCount = { inc_votes: 5 }
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
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      })
    })
  })
  test("200: Updates the votes property correctly when passed a negative number", () => {
    const newVoteCount = { inc_votes: -42 }
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
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      })
    })
  })
  test("404: Responds with message when given a valid but non-existent article_id", () => {
    const newVoteCount = { inc_votes: 5 }
    return request(app)
    .patch("/api/articles/999")
    .send(newVoteCount)
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Article_id does not exist")
    })
  })
  test("400: Responds with Bad Request when given an invalid article_id", () => {
    const newVoteCount = { inc_votes: 5 }
    return request(app)
    .patch("/api/articles/not-an-article")
    .send(newVoteCount)
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad request")
    })
  })
})

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes comment and provides no response", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
  })
  test("400: Responds with Bad Request when given an invalid comment_id", () => {
    return request(app)
    .delete("/api/comments/not-a-comment")
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad request")
    })
  })
})

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects with username, name, and avatar_url properties", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({ body: { users } }) => {
      expect(users.length).toBe(4)
      users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        })
      })
    })
  })
})