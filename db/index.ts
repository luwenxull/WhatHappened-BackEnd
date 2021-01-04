import factory from './factory';

interface DBDocument {
  _id?: string;
}

interface User extends DBDocument {
  username: string;
  password: string;
  filePath: string;
}

export const user = factory<User>('user');

export interface Event extends DBDocument {
  uuid: string;
}

export const event = factory<Event>('event');
