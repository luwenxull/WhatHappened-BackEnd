import getDB from "./getDB";

export default function <T>(collection: string) {
  return {
    async create(data: T) {
      const c = (await getDB()).collection(collection);
      return c.insertOne(data);
    },

    async find(of: Partial<T>) {
      return (await getDB()).collection(collection).find(of).toArray();
    },
  };
}
