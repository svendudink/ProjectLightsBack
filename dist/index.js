"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const schemas_1 = __importDefault(require("./graphql/schemas"));
const resolvers_1 = require("./graphql/resolvers");
const sqlite3 = require("sqlite3").verbose();
const app = (0, express_1.default)();
const db = new sqlite3.Database("db.sqlite", (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
    else {
        console.log("Connected to the SQLite database.");
    }
});
exports.db = db;
// Cors
const corsOptions = {
    origin: "https://bottleluminousback.herokuapp.com",
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// End of Cors
const port = process.env.PORT || 8080;
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static("build"));
    app.get("*", (req, res) => {
        req.sendFile(path.resolve(__dirname, "build", "index.html"));
    });
}
// Express
app.use(body_parser_1.default.json());
app.listen(port);
//End of Express
//GraphQL
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schemas_1.default,
    rootValue: resolvers_1.graphqlResolver,
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
}));
