require("dotenv").config();

// In-memory mock store for when database is unavailable
const memoryStores = new Map();
let nextId = 100;

function getStore(model) {
  const key = model.toLowerCase();
  if (!memoryStores.has(key)) {
    memoryStores.set(key, []);
  }
  return memoryStores.get(key);
}

// Seed default admin and department in mock store
const bcrypt = require("bcryptjs");
const defaultAdminHash = bcrypt.hashSync("Admin@123", 10);
getStore("user").push({
  id: 1,
  name: "Jeevanta Admin",
  email: "admin@jeevanta.gov.in",
  passwordHash: defaultAdminHash,
  role: "ADMIN",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

getStore("department").push({
  id: 1,
  name: "General Medicine",
  description: "General medical consultation department",
  createdAt: new Date(),
});

function createMockModel(modelName) {
  const store = getStore(modelName);
  return {
    findMany: async (args = {}) => {
      let items = [...store];
      if (args.where) {
        items = items.filter((item) =>
          Object.entries(args.where).every(([k, v]) => item[k] === v)
        );
      }
      return items;
    },
    findFirst: async (args = {}) => {
      const items = store.filter((item) =>
        !args.where || Object.entries(args.where).every(([k, v]) => item[k] === v)
      );
      return items[0] || null;
    },
    findUnique: async (args = {}) => {
      if (!args.where) return null;
      return (
        store.find((item) =>
          Object.entries(args.where).some(([k, v]) => item[k] === v)
        ) || null
      );
    },
    create: async (args = {}) => {
      const id = nextId++;
      const record = {
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(args.data || {}),
      };
      store.push(record);
      return record;
    },
    update: async (args = {}) => {
      const index = store.findIndex((item) =>
        args.where && Object.entries(args.where).some(([k, v]) => item[k] === v)
      );
      if (index === -1) {
        const fallback = { id: args.where?.id || nextId++, ...(args.data || {}) };
        store.push(fallback);
        return fallback;
      }
      store[index] = {
        ...store[index],
        ...(args.data || {}),
        updatedAt: new Date(),
      };
      return store[index];
    },
    delete: async (args = {}) => {
      const index = store.findIndex((item) =>
        args.where && Object.entries(args.where).some(([k, v]) => item[k] === v)
      );
      if (index !== -1) {
        const [removed] = store.splice(index, 1);
        return removed;
      }
      return {};
    },
    count: async () => store.length,
  };
}

let prisma;
try {
  if (process.env.DB_HOST && process.env.DB_NAME) {
    const { PrismaClient } = require("@prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const adapter = new PrismaPg({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    prisma = new PrismaClient({ adapter });
  } else {
    throw new Error("No database credentials configured");
  }
} catch (error) {
  console.warn("[AI Studio] Database not connected — using mock");
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d) => d?.data ?? {},
    update: async (d) => d?.data ?? {},
    delete: async () => ({}),
  };
  prisma = new Proxy(
    {
      $connect: async () => {},
      $disconnect: async () => {},
    },
    {
      get: (target, prop) => {
        if (prop in target) return target[prop];
        return createMockModel(String(prop));
      },
    }
  );
}

module.exports = prisma;
