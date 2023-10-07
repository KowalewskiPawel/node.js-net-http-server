const net = require("net");
const os = require("os");

const sendBasicGetResponse = (socket) => {
  const httpResponse = 'HTTP/1.1 200 OK\r\n\r\n';
  socket.write(httpResponse);
};

const sendEchoResponse = (socket, echoString) => {
  const httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${echoString.length}\r\n\r\n${echoString}`;
  socket.write(httpResponse);
};

const sendUserAgentResponse = (socket, userAgent) => {
  const httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
  socket.write(httpResponse);
};

const send404Response = (socket) => {
  const httpResponse = 'HTTP/1.1 404 NOT FOUND\r\n\r\n';
  socket.write(httpResponse);
};

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log(os.cpus().length);
    const request = data.toString();

    if (request.startsWith('GET / ')) {
      sendBasicGetResponse(socket);
    } else if (request.startsWith('GET /user-agent')) {
      const [_, userAgent] = request.match(/User-Agent:\s*(.+?)\s*$/m);
      sendUserAgentResponse(socket, userAgent);
    } else if (request.startsWith('GET /echo/')) {
      const [_, echoString] = request.match(/\/echo\/([^ ]+)/);
      sendEchoResponse(socket, echoString);
    }
    else {
      send404Response(socket);
    }
    socket.end();
  });
});

server.listen(4221, "localhost", () => {
  process.stdout.write("Listening on localhost:4221");
});
