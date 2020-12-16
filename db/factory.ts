import getDB from "./getDB";

export default function <T>(collection: string) {
  return {
    async create(data: T) {
      const c = (await getDB()).collection(collection);
      c.insertOne(data);
    },

    async getAll(): Promise<T[]> {
      return (await getDB()).collection("user").find({}).toArray();
    },
  };
}
