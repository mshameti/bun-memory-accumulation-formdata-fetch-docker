const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  // Do 50ms of work and respond with 200.
  if (req.method === "POST" && req.url === "/") {
    setTimeout(() => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("processing for 50ms...");
    }, 50);
  } else if (req.method === "GET" && req.url === "/image") {
    const imagePath = path.join(
      __dirname,
      "Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01.jpg"
    );

    fs.readFile(imagePath, (_, data) => {
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(data);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
