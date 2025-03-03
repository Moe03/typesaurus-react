import { schema, Typesaurus } from "@tixae-labs/typesaurus";

export const db = schema(($) => ({
  users: $.collection<User>().sub({
    notes: $.collection<Note>(),
  }),
  orders: $.collection<Order>(),
  books: $.collection<Book>(),
}));

// Infer schema type helper with shortcuts to types in your database:
//   function getUser(id: Schema["users"]["Id"]): Schema["users"]["Result"]
export type Schema = Typesaurus.Schema<typeof db>;

// Your model types:

export interface User {
  id: string;
  name: string;
}

interface Note {
  text: string;
}

interface Order {
  userId: Schema["users"]["Id"];
  bookId: Schema["books"]["Id"];
}

interface Book {
  title: string;
}

