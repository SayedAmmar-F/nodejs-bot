const express = require("express"); // Import the express library
const app = express(); // Launch the express app
const http = require("http"); // Import the http library
const server = http.createServer(app); // Create the server

/** Replying to request at '/' */
app.get("/", (req, res) => {
  res.send("Testing...");
});

server.listen(3000, () => {}); // Opening the 3000 port
