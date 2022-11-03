import express from "express";
import fs from "fs";
import { graphqlHTTP } from "express-graphql";
import bodyParser from "body-parser";
import cors from "cors";
import graphqlSchema from "./graphql/schemas";
import { graphqlResolver } from "./graphql/resolvers";
const sqlite3 = require("sqlite3").verbose();

const app = express();

const db = new sqlite3.Database("db.sqlite", (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Cors
const corsOptions = {
  origin: "https://bottleluminousback.herokuapp.com",
  credentials: true,
};
app.use(cors(corsOptions));
// End of Cors

const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.get("*", (req, res) => {
    req.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

// Express
app.use(bodyParser.json());

app.listen(port);
//End of Express

//GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "an error occured";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

// end of GraphQL

export { db };
