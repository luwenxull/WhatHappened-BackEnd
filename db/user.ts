import factory from "./factory";

interface User {
  name: string;
  password: string;
}

export default factory<User>("user");
