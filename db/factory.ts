import getDB from "./getDB";

function emptyModifier(from: string) {
  return from;
}

export default function <T>(collection: string) {
  return {
    async create(data: T, modifier: (from: string) => string = emptyModifier) {
      const c = (await getDB()).collection<T>(modifier(collection));
      return c.insertOne(data as any).then((_) => _.ops[0]);
    },

    async find(
      of: Partial<T>,
      modifier: (from: string) => string = emptyModifier
    ) {
      return (await getDB())
        .collection<T>(modifier(collection))
        .find(of)
        .toArray();
    },

    async remove(
      of: Partial<T>,
      modifier: (from: string) => string = emptyModifier
    ) {
      return (await getDB()).collection<T>(modifier(collection)).deleteMany(of);
    },

    async modify(
      filter: Partial<T>,
      doc: Partial<T>,
      modifier: (from: string) => string = emptyModifier
    ) {
      return (await getDB())
        .collection<T>(modifier(collection))
        .updateOne(filter, {
          $set: doc,
        });
    },
  };
}
