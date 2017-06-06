$(function () {


  //*********** DRAW *************//

  //socket

  var socket = io();
  var user;


  /* Drawing on Paint App */
  var canvas = $('#canvas');
  var timerClock = $('#timerclock');
  ctx = canvas[0].getContext('2d');
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'blue';
  var lastpoint = null;
  var painting = false;
  var timeleft;
  var drawingTimer;



  function draw(line) {
    ctx.beginPath();
    
    if(line.from) {
        ctx.moveTo(line.from.x, line.from.y);
    }else{
      ctx.moveTo(line.to.x-1, line.to.y);
    }
      
    ctx.lineTo(line.to.x, line.to.y);
    ctx.closePath();
    ctx.stroke();
  }
    
  // Disable text selection on the canvas
  canvas.mousedown(function () {
    return false;
  });
  
  canvas.mousedown(function(e) {
    if(user.status == 'DRAWER') {
      painting = true;
      var newpoint = { x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop},
        line = { from: null, to: newpoint, color: ctx.strokeStyle };
      
      draw(line);
      lastpoint = newpoint;
      socket.emit('draw', line);
    }
  });
  
  canvas.mousemove(function(e) {
    if(user.status == 'DRAWER' && painting) {
      var newpoint = { x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop},
        line = { from: lastpoint, to: newpoint, color: ctx.strokeStyle, width: ctx.lineWidth};
      
      draw(line);
      lastpoint = newpoint;
      socket.emit('on-draw', line);
    }
  });
  
  canvas.mouseout(function(e) {
    painting = false;
  });
    
  canvas.mouseup(function(e) {
    painting = false;
  });


  $('#eraser').click(function(){
    if($(this).hasClass('selected')){ //come back to pen
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 5;
      $(this).removeClass('selected');
    } else {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 30;
      $(this).addClass('selected');
    }
  });


  //pseudo
  $('#send-pseudo').submit(function(){
    var value = $('#pseudo-input').val();
    if(value.trim().length>0){
      socket.emit('new-player', $('#pseudo-input').val());
      $('#pseudo-input').val('');
    }
    return false;
  });

  // socket.on('join-room', function(){
  // });

  //receive only by the new user after sending pseudo
  socket.on('game-joined', function(auser){
    // hide and show right div
    $('#pseudo-screen').addClass('hidden');
    $('#game-screen').removeClass('hidden');
    user = auser;
    console.log('Je suis : '+user.id);
  });

  socket.on('new-drawer', function(drawerUser){
    console.log('le Drawer est : '+ drawerUser.id);

    if(user.id == drawerUser.id){ //we are the drawer
      console.log(drawerUser);
      user = drawerUser;
      $('#main-content').addClass('drawer');
      $('#game-screen input, #game-screen button').prop('disabled', true);
    } else {
      user.status = 'PLAYER';
      $('#main-content').removeClass('drawer');
      $('#game-screen input, #game-screen button').prop('disabled', false);
    }
  });

  socket.on('start-round', function(word, atimeleft){
    timeleft = atimeleft;
    clearInterval(drawingTimer);
    drawingTimer = setInterval(timerTick, 1000);
    console.log('set interval');
    //clear canvas, set new canvas because of jquery selector
     var myCanvas = document.getElementById("canvas");
     var ctx = myCanvas.getContext('2d');
     ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    if(user.status == 'DRAWER'){
        $('.drawer-div .state').text("Dessinez un/une \""+word+"\" !");
    } else {
        $('.drawer-div .state').text("Trouvez ce qui est dessiné !");
    }
  });

  function timerTick() {
		if(timeleft > 0) {
			timeleft = timeleft-1000;
			timerClock.html('Temps restant : ' + timeleft/1000 + ' seconde(s)');
		} else {
			clearInterval(drawingTimer);
			timerClock.html('');
      socket.emit('timeout');
		}
	}


  //messages
  $('#send-message').submit(function(e){
    e.preventDefault();
    var value = $('#message-input').val();
    if(value.trim().length>0){
      socket.emit('message', value);
      $('#message-input').val('');
    }
  });

  socket.on('message', function(msg, user){
    $('#message-list').append('<li><span class="username" style="color:' + user.color + '">' + user.name + ':</span> ' + msg +'</li>');
  });

  socket.on('special-message', function(msg){
    $('#message-list').append('<li class="special" style="background-color:'+msg.color+'">'+msg.content+'</li>');
  });

  function scrollDownChat() {
    // $('#tchat').scrollTop($('#message-list')[0].height); marche pas
  };


  socket.on('userConnected', function(myNick){
    $('#message-list').append('<li>' + myNick + ' s\'est connecté ! </li>');
  });


  socket.on('draw', function(line) {
    if(user.status == 'PLAYER' && line) {
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.beginPath();
        if(line.from){
          ctx.moveTo(line.from.x, line.from.y);
        }else{
          ctx.moveTo(line.to.x-1, line.to.y);
        }
        ctx.lineTo(line.to.x, line.to.y);
        ctx.closePath();
        ctx.stroke();
    }
  });
  
});