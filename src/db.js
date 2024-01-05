import mongodb from 'mongodb';

function getMongoClient() {
  return mongodb.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
}

module.exports = getMongoClient;