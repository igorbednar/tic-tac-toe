var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var webSocketHandler = require('./modules/web_socket/handler')

var portNumber = process.env.NODE_PORT_NUMBER || 3000;
server.listen(portNumber);

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    webSocketHandler.handle(io,socket);
});