const express = require("express");
const http = require("http");
const path = require("path");
require("./db/mongoConct");

const { routesInit } = require("./routes/configRoutes");

const app = express();

// 🔹 Add middleware to parse JSON requests
app.use(express.json());

// 🔹 Serve static files
app.use(express.static(path.join(__dirname, "public")));

// 🔹 Initialize routes
routesInit(app);

const server = http.createServer(app);

// 🔹 Start the server on port 3001
server.listen(3001, () => {
  console.log("Server running on http://localhost:3001/");
});
