const { MongoClient } = require('mongodb');
const config = require('./config');
const error = require('./middleware/error');

const { dbUrl } = config;
const client = new MongoClient(dbUrl);

async function connect() {
  // TODO: Database Connection
  // Connection URL
  try {
    const dbName = 'users';
    if (!dbUrl) {
      console.error('Database URL is not provided in the configuration', error);
    }
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Error to connect: ', error);
  }
}

module.exports = { connect };
