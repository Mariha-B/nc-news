# Project Name

## Summary

The Northcoders News API is a backend service designed to provide access to application data. Modelled after platforms like Reddit, this API allows users to interact with various features such as articles, comments, topics, and users.

The API offers endpoints to get, create, update, and delete data. It utilises a PostgreSQL database and interacts with it using node-postgres.

## Demo

Check out the hosted version [here](https://nc-news-gnke.onrender.com/).

## Installation and Setup

Follow these steps to set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://https://github.com/Mariha-B/nc-news.git

   ```

2. **Navigate to the project directory and install dependencies:**
   ```bash
   npm install husky
   npm install dotenv
   npm install express
   npm install nodemon
   npm install pg
   npm install pg-format
   ```
3. **Create two .env files: .env.development and .env.test.**

   Create files .env.test and a .env.development with the contents PGDATABASE=nc_news_test and PGDATABASE=nc_news respectively to connect the databases locally.

4. **Seed the local database:**

   ```bash
       npm run setup-dbs
       npm run seed
   ```

5. **Run tests:**

   ```bash
       npm test app.test.js
   ```

6. **Requirements:**
   Make sure you have the following software installed:

   Node.js (version v21.2.0.)
   PostgreSQL (version 14.10)

## Contributors

Mariha Butt
