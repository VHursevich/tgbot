import mongodb from 'mongodb';

function getMongoClient() {
  return mongodb.connect(process.env.DB_URL);
}

module.exports = getMongoClient;