var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];

io.origins('*:*');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/nick.html');
});

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var color = '#0b5de2';
  socket.on('setNick', function(nick){
      io.sockets.emit('setNick', {id: socket.id, nick: nick, color: color });
      for (var i = 0; i < users.length; i++) {
        if(users[i].id == socket.id) {
          users[i].nick = nick;
          break;
        }
      }
      users.push({ id: socket.id, nick: nick, color: color });
      console.log(nick + ' connected');
      console.log(users);
  })
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(5000, function(){
  console.log('listening on *:5000');
});