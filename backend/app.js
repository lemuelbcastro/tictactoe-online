var express = require('express');
var http = require('http');
const { WebSocketServer } = require('ws');

var app = express();
var server = http.createServer(app);

const ws = new WebSocketServer({ server });

ws.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

var port = process.env.PORT || 3000;
server.listen(port);
