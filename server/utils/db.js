const { neon } = require('@neondatabase/serverless');

const getDbClient = () => {
  return neon(`${process.env.DATABASE_URL}`);
};

module.exports = { getDbClient };
