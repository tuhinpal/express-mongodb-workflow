const { MongoClient } = require("mongodb");
require("dotenv").config();

module.exports = async (database) => {
  var conn = await MongoClient.connect(
    process.env.MONGO_URL || process.env.MONGODB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  return {
    conn,
    db: conn.db(database || process.env.DATABASE_NAME),
  };
};
