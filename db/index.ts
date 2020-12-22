import factory from "./factory";

interface DBDocument {
  _id?: string;
}

interface User extends DBDocument {
  username: string;
  password: string;
  filePath: string;
}

export const user = factory<User>("user");

interface Time extends DBDocument {
  date: number;
  description: string;
  groupID: string;
}

interface Group extends DBDocument {
  uuid: string;
  name: String;
  emotion: 0 | 1;
  times: Time[];
}

export const group = factory<Group>("group");

export const groupTime = factory<Time>("groupTime");
