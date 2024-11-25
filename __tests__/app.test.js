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
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      })
    })
  })
  test("GET 404 Responds with message when given a valid by non-existent article_id", () => {
    return request(app)
    .get("/api/articles/999")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Article_id does not exist")
    })
  })
  test ("GET 400 sends sends Bad Request when given an invalid article_id", () => {
    return request(app)
    .get("/api/articles/not-an-article")
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad request")
    })
  })
})
/* describe("/api/articles", () => {
  test("GET 200 Responds with an array of all articles, sorted by date descending", () => {
    return request(app)
  })
}) */