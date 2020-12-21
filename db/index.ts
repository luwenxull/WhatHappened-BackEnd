import factory from "./factory";

interface User {
  username: string;
  password: string;
  filePath: string;
}

export const user = factory<User>("user");

interface Time {
  date: number;
  description: string;
}

interface Group {
  uuid: string;
  name: String;
  emotion: 0 | 1;
  times: Time[];
}

export const group = factory<Group>("group");
