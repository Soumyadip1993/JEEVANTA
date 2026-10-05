require('dotenv').config();

const { Pool } = require('pg');
const { ensureRequiredEnv } = require('./env');

ensureRequiredEnv();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
