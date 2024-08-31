const http = require("http");

const server = http.createServer((req, res) => {
  // Do 50ms of work and respond with 200.
  if (req.method === "POST" && req.url === "/") {
    setTimeout(() => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("processing for 50ms...");
    }, 50);
  }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
