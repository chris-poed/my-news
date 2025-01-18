# My News API

Welcome to My News API, a RESTful API built using **Node.js**, **PostgreSQL**, and **Express** to be used as the backend service for an interactive news site such as [Reddit](https://www.reddit.com/ "Reddit") or [DIGG](https://www.reddit.com/r/explainlikeimfive/comments/3bzibi/eli5_what_happened_to_digg/?rdt=62868 "So what happenened to DIGG?"). The API enables fetching of articles, topics, comments and users with additional queries for some endpoints, and has a full relational database seeded with test and development data.

**[Check out the hosted version on Render here](https://my-news-2.onrender.com/api/ "My News API hosted on Render")** 

<br>

## Tech stack used
- Node.js v23.1.0
- PostgreSQL v16.4
- Express v4.21.1
- Jest v27.5.1  (with Jest-Extended and Jest-Sorted packages)
- Supertest v7.0.0
- Husky v8.0.2
- Supabase
- Render

<br>

## Getting started

#### Access the hosted version on Render: https://my-news-2.onrender.com/api/ 

Use the endpoint reference below (`/api` returns a full list of endpoints and request info)

Or, follow the steps below to set up a local repo.

<br>

## Setup local repo

##### 1. Fork and clone this repo

##### 2. Install dependencies

    $ npm install

##### 3. Setup and seed the local database

    $ npm run setup-dbs

    $ npm run seed

##### 4. Add both `.env.test` and `.env.development` files

Files must be in the root directory of the project, with `PGDATABASE=<your_dev_db_name>` and `PGDATABASE=<your_test_db_name>` in the respective files.

##### 5. Run test suites

    $ npm run test

<br>

## API endpoints

Features CRUD operations for Articles, Topics, Comments and Users.

#### Return a list of all available endpoints and request details:

    GET /api 

### Articles

##### Fetch all articles, with optional queries:
    
    GET /api/articles

    ?sort_by (created_at (default), title, author, body, votes, article_img_url)
    ?order (desc (default), asc)
    ?topic (filter by topic)

##### Fetch a single article by ID:

    GET /api/articles/:article_id

##### Fetch comments for a specific article:

    GET /api/articles/:article_id/comments

##### Add a comment to a specific article:

    POST /api/articles/:article_id/comments

##### Update an article (votes currently only supported):

    PATCH /api/articles/:article_id

### Topics

##### Fetch all topics:

    GET /api/topics

### Comments

##### Delete a comment:

    DELETE /api/comments/:comment_id

### Users

##### Fetch all users:

    GET /api/users



<br>
<br>
<br>

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
