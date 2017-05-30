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
  var user;

  socket.on('new-player', function(name){
      var myName = name;
      console.log(users);  
      users.push({ id: socket.id, name: name, color: color });          
      for (var i = 0; i < users.length; i++) {
        console.log("-----");        
        console.log(users[i].id);
        console.log("-----");
        console.log(socket.id);
        console.log("-----");
      
        if(users[i].id == socket.id) {
          user = users[i];
          break;
        }
      }
      io.sockets.emit('game-joined');
      io.sockets.emit('special-message', {color : color, content: name + ' a rejoint'})
      console.log(name + ' connected');
      console.log(user);
  });
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