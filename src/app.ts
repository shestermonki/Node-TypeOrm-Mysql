import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema";

const app = express();
const whileList = ["http://localhost:4200/"];

app.use(cors({ origin: whileList }));

app.use(
  "/graphsql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
  })
);




export default app;
//txt
