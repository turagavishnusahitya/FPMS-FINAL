const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER, // expects DB_USER
  host: process.env.DB_HOST, // expects DB_HOST
  database: process.env.DB_NAME, // expects DB_NAME
  password: process.env.DB_PASSWORD, // expects DB_PASSWORD (not DB_PASS)
  port: process.env.DB_PORT, // expects DB_PORT
});

module.exports = pool;
