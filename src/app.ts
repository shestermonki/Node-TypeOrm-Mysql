import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema";

const app = express();

app.use(
  "/graphsql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
  })
);

export default app;
//txt