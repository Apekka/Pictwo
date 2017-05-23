var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];

app.use(express.static(__dirname));

io.origins('*:*');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var color = '#0b5de2';
  var user = {id: socket.id, name: 'Dokunu', color: color}
  socket.on('new-player', function(nick){
      io.sockets.emit('', {id: socket.id, nick: nick, color: color });
      for (var i = 0; i < users.length; i++) {
        if(users[i].id == socket.id) {
          users[i].nick = nick;
          break;
        }
      }
      users.push({ id: socket.id, nick: nick, color: color });
      io.sockets.emit('game-joined');
      console.log(nick + ' connected');
      console.log(users);
  })
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('message', function(msg){
    console.log('message: ' + msg);
    io.sockets.emit('message', msg, user);
  });
});

http.listen(5000, function(){
  console.log('listening on *:5000');
});