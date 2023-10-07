const net = require("net");
const fs = require('fs');

const directory = process.argv[3];

const sendFileResponse = (socket, file) => {
  const httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${file.length}\r\n\r\n${file}`;
  socket.write(httpResponse);
};

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
    const request = data.toString();

    if (request.startsWith('GET / ')) {
      sendBasicGetResponse(socket);
    } else if (request.startsWith('POST /files/')) {
      const [_, requestedFile] = request.match(/\/files\/([^ ]+)/);
      const filePath = `${directory}/${requestedFile}`;

      const body = request.split('\r\n\r\n')[1];

      const httpResponse = 'HTTP/1.1 201 OK\r\n\r\n';

      fs.writeFileSync(filePath, body);

      socket.write(httpResponse);
    } else if (request.startsWith('GET /files/')) {
      const [_, requestedFile] = request.match(/\/files\/([^ ]+)/);
      const filePath = `${directory}/${requestedFile}`;

      if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath, 'utf8');
        sendFileResponse(socket, file);
      } else {
        send404Response(socket);
      }
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
