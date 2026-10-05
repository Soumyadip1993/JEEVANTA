require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { ensureRequiredEnv } = require('./env');

ensureRequiredEnv();

const prisma = new PrismaClient();

module.exports = prisma;
