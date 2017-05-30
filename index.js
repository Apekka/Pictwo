var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var users = [];
var dictionnary;
var words = [];
var rounds = []; //word, drawer, winner
var roundIndex = 0;

app.use(express.static(__dirname));

io.origins('*:*');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var color = '#0b5de2';
  var status = 'PLAYER';
  var user;
  var score = 0;
 

  startGame();
 


  function startGame() {
    fs.readFile(__dirname + '/dictionnary.txt', function (err, data) {
        console.log('ca passe dedans');
      
        dictionnary = data.toString('utf-8').split('\r\n');
        
      while(words.length < 10){
        var randomnumber = Math.ceil(Math.random()*dictionnary.length-1)
        if(words.indexOf(randomnumber) > -1) continue;
        words[words.length] = randomnumber;
      }
      for (var i = 0; i < words.length; i++) {
        
        rounds[i] = {};
        rounds[i].word = dictionnary[words[i]];
      }
    })
    
  startRound();
  }; 

  function startRound() {
    //il va falloir envoyer le mot en cours
    //envoie a chacun le role qu'il a
    
    if (roundIndex == 0) {
      console.log(rounds);
      rounds[roundIndex].drawer = users[0];
    } else {
      rounds[roundIndex].drawer = rounds[roundIndex-1].winner;
    }

    io.sockets.emit('new-drawer', rounds[roundIndex].drawer);
    console.log(rounds[roundIndex].drawer);
    io.sockets.emit('start-round', rounds[roundIndex].word);
    console.log(rounds[roundIndex].word);
    
  }
   

  socket.on('new-player', function(name){
      var myName = name;
      users.push({ id: socket.id, name: name, color: color, score: score, status: status });          
      for (var i = 0; i < users.length; i++) {      
      
        if(users[i].id == socket.id) {
          user = users[i];
          break;
        }
      }
      io.sockets.emit('game-joined', user);
      
      io.sockets.emit('special-message', {color : color, content: name + ' a rejoint'});

      if(users.length < 2) {
        io.sockets.emit('special-message', {color: color, content: 'En attente d\'un autre joueur...'});
      }

      console.log(name + ' connected');
      console.log(users);
  });
  socket.on('disconnect', function(){
    // 
    for (var i = 0; i < users.length; i++) {
      if(users[i].id == socket.id) {
        users.splice(i, 1);
        break;
      }
    }
    console.log('user disconnected :' + socket.id );
  });
  socket.on('message', function(msg){
    console.log('message: ' + msg);
    io.sockets.emit('message', msg, user);


  });
});

http.listen(5000, function(){
  console.log('listening on *:5000');
});