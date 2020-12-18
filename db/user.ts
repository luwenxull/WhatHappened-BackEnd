import factory from "./factory";

interface User {
  name: string;
  password: string;
  filePath: string;
}

export default factory<User>("user");
