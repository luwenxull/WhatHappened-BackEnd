import { Db, MongoClient } from "mongodb";

// Replace the following with values for your environment.
const username = encodeURIComponent("wenxu");
const password = encodeURIComponent(process.env.MONGO_PWD as string);
console.log("use password: ", process.env.MONGO_PWD);
const clusterUrl = "127.0.0.1:27017";

const authMechanism = "DEFAULT";

// Replace the following with your MongoDB deployment's connection string.
const uri = `mongodb://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}&authSource=whatHappened`;

// Create a new MongoClient
const client = new MongoClient(uri);

let connection: Promise<Db>;

// Function to connect to the server
export default function (): Promise<Db> {
  if (!connection) {
    connection = client.connect().then(() => {
      return client.db("whatHappened");
    });
  }
  return connection;
}
