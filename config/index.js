var allTheSettings = {
  coinbaseApiKey: process.env.COINBASE_API_KEY,
  coinbaseApiSec: process.env.COINBASE_API_SECRET,
  coinbaseApiUri: process.env.COINBASE_API_URI,
  coinbaseApiWallet: process.env.COINBASE_API_WALLET,
  dbDb: process.env.DATABASE_DB,
  dbHost: process.env.DATABASE_HOST,
  dbPass: process.env.DATABASE_PASS,
  dbUrl: process.env.DATABASE_URL,
  dbUser: process.env.DATABASE_USER,
  redisUrl: process.env.REDIS_URL,
  secret: process.env.SECRET,
  mailerUser: process.env.MG_USER,
  mailerPass: process.env.MG_PASS
};

module.exports = allTheSettings;
