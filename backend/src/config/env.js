const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];

const getMissingEnv = () => requiredEnv.filter((key) => !process.env[key]);

const ensureRequiredEnv = () => {
  const missing = getMissingEnv();
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

module.exports = {
  ensureRequiredEnv,
  getMissingEnv,
};
