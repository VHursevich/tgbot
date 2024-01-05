import {MongoClient} from 'mongodb';

export default MongoClient.connect(process.env.DB_URL);