import { MongoClient } from 'mongodb';

class BaseService {
  private mongoURI = process.env.MONGO_URI;

  async getConnectedDBClient(): Promise<MongoClient> {
    const client = await new MongoClient(this.mongoURI, { useNewUrlParser: true });
    await client.connect();
    return client;
  }
}

export default BaseService
