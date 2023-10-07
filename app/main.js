const http = require("http");

const server = http.createServer((_req, res) => {
  res.end("HTTP/1.1 200 OK\r\n\r\n");
});

server.listen(4221, "localhost", () => {
  process.stdout.write("Listening on localhost:4221");
});
