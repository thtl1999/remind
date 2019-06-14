var socket = io()
var ishost = 0;
var player = null
var playerName = [null, null, null, null, null, null]
var charaNum = [null, null, null, null, null, null]

socket.on('connect', function() {
  socket.emit('newUser_Game')
})

socket.on('init_Game', function(data) {
  ishost = data.ishost;
  player = 'player' + String(data.player);
  playerName = data.playerNames;
  charaNum = data.charaNums;

  timetick(999);

  for(var i = 0 ; i < 6 ; i++) {
    if(data.users[i] == 0) {
      assignchara('player' + String(i+1), 'Character_' + String(3 - charaNum[i] % 3));
      assignscore('p' + String(i+1), playerName[i], 0);
    }
  }
  startbutton();
})


socket.on('update_Game_timer', function(data) {
  //console.log("남은 시간 정보: " + data)
  timetick(data);
})



socket.on('update_Game_score', function(data) {
  //console.log("현재 스코어 정보: " + data)
  for(var i = 0 ; i < 6 ; i++) {
    if(data[i] != -1) {
      assignscore('p' + String(i+1), playerName[i], data[i]);
    }
  }
})

socket.on('update_Game_score_inform', function(data) {
  inform(playerName[data.answerNum] + "님이 '" + data.answer + "', 맞추셨습니다!<br><br>" + playerName[data.answerNum] + ": +100<br>" + playerName[data.drawerNum] + ": +100");
})

socket.on('update_Game_score_inform2', function(data) {
  inform(playerName[data.mineNum] + "님이 '" + data.mine + "', 지뢰를 터트리셨습니다!<br><br>" + playerName[data.drawerNum] + ": -50");
})


socket.on('update_Game_round', function(data) {
  console.log("현재 라운드 정보: " + data)
  document.getElementById("answerword").innerHTML = '';
  document.getElementById("mineword").innerHTML = '';
  drawturn = 0;
})

socket.on('update_Game_round_inform', function(data) {
  inform(playerName[data] + "님의 차례!<br>준비하세요!");
})

socket.on('update_Game_round_yourdrawturn', function(data) {
  //console.log("내 그림 차례입니다, 제시어: " + data)
  document.getElementById("answerword").innerHTML = '정답: ' + data.answerword;
  document.getElementById("mineword").innerHTML = '유사어: ' + data.mineword;

  drawturn = 1;
})







socket.on('wrongAccess', function() {
  console.log('wrongAccess');
  location.href = '../';
})

socket.on('ended_Game', function(data) {
  location.href = '../MakeRoom/' + data;
})


/* 서버로부터 데이터 받은 경우 */
socket.on('update', function(data) {
/*  var chat = document.getElementById('chat1')

  var message = document.createElement('div')
  var node = document.createTextNode(`${data.name}: ${data.message}`)
  var className = ''

  // 타입에 따라 적용할 클래스를 다르게 지정
  switch(data.type) {
    case 'message':
      className = 'other'
      break

    case 'connect':
      className = 'connect'
      break

    case 'disconnect':
      className = 'disconnect'
      break
  }
*/
  console.log(data.name + ": " + data.message);
  makes(data.player, data.message);
  //message.classList.add(className)
  //message.appendChild(node)
  //chat.appendChild(message)
})



function start(maxRound, maxTime) {
  if(!ishost)
    return
  socket.emit('startGame');
}

/* 메시지 전송 함수 */
function send(message) {

  /*
  // 입력되어있는 데이터 가져오기
  var message = document.getElementById('test').value
  
  // 가져왔으니 데이터 빈칸으로 변경
  document.getElementById('test').value = ''

  // 내가 전송할 메시지 클라이언트에게 표시
  var chat = document.getElementById('chat')
  var msg = document.createElement('div')
  var node = document.createTextNode(message)
  msg.classList.add('me')
  msg.appendChild(node)
  chat.appendChild(msg)
  */
  //console.log(io.sockets.manager.rooms)

  // 서버로 message 이벤트 전달 + 데이터와 함께
  socket.emit('message', {type: 'message', message: message, name: socket.name, player: player});
  //makes(player, message);
}

// more paint

//  // Definitions
  var canvas = document.getElementById("paint-canvas");
  var context = canvas.getContext("2d");
  var boundings = canvas.getBoundingClientRect();
  var drawturn = 0;
  
  // Specifications
  var mouseX = 0;
  var mouseY = 0;
  var touchX = 0;
  var touchY = 0;
  context.lineJoin = "round";
  context.strokeStyle = 'black'; // initial brush color
  context.lineWidth = 10; // initial brush width
  var isDrawing = 0;
  var linewidth = 10;
  var linecolor = 'black';

  //draw turn
  function drawingturn(){
    drawturn = 1;
  }
  function answerturn(){
    drawturn = 0;
  }


  // Handle Colors
  var colors = document.getElementsByClassName('colors')[0];

  colors.addEventListener('click', function(event) {
    context.strokeStyle = event.target.value || 'black';
    linecolor = context.strokeStyle;
    isDrawing = 0;
  });

  // Handle Brushes
  var brushes = document.getElementsByClassName('brushes')[0];

  brushes.addEventListener('click', function(event) {
    context.lineWidth = event.target.value || 1;
    linewidth = context.lineWidth;
    isDrawing = 0;
  });


  //touch event for mobile
  // canvas.addEventListener('touchstart', touchstartf(event),false);
  var testvalue = 0;

  if ('ontouchstart' in window)
  {
  
    function gettouchpos(e){
      if (!e) var e = event;
  
      var touch = e.touches[0];
      touchX=touch.pageX-touch.target.offsetLeft;
      touchY=touch.pageY-touch.target.offsetTop;
      
      return [touchX,touchY];
    }
  
    function touchstartf(e){
      if (drawturn == 0) return;
  
      gettouchpos();
      drawline(touchX-1,touchY,touchX,touchY,linewidth,linecolor);
      // e.preventDefault();
    }
  
  
    
    function touchmovef(e){
      if (drawturn == 0) return;
  
      var x1 = touchX;
      var y1 = touchY;
      gettouchpos(e);
      drawline(x1,y1,touchX,touchY,linewidth,linecolor);
      // e.preventDefault();
    }


  canvas.addEventListener('touchstart', touchstartf,false);
  canvas.addEventListener('touchmove', touchmovef);
  canvas.addEventListener('mousemove', touchmovef(event), false );

  

  }
  else{

  


  // Mouse Down Event
  canvas.addEventListener('mousedown', function(event) {
    if (drawturn == 0) return;

    setMouseCoordinates(event,this);
    isDrawing = 1;

    drawline(mouseX-1,mouseY,mouseX,mouseY,linewidth,linecolor);
  });

  // Mouse Move Event
  canvas.addEventListener('mousemove', function(event) {
    if (drawturn == 0) return;

    if(isDrawing == 1){
      var x1 = mouseX;
      var y1 = mouseY;
      setMouseCoordinates(event,this);
      //context.lineTo(mouseX, mouseY);
      //context.stroke();
      drawline(x1,y1,mouseX,mouseY,linewidth,linecolor);
    }
  });

  // Mouse Up Event
  window.addEventListener('mouseup', function(event){
    if (drawturn == 0) return;
    setMouseCoordinates(event,this);
    isDrawing = 0;
  })

  canvas.addEventListener('mouseleave', function(event) {
    if (drawturn == 0) return;
    if (isDrawing == 1) isDrawing = -1;
  })

  canvas.addEventListener('mouseenter', function(event) {
    if (drawturn == 0) return;
    setMouseCoordinates(event,this);
    if (isDrawing == -1) isDrawing = 1;
    context.moveTo(mouseX, mouseY);
  });

  // Handle Mouse Coordinates
  function setMouseCoordinates(e,c) {
    //mouseX = event.clientX - boundings.left;
    //mouseY = event.clientY - boundings.top;
    mouseX = e.pageX - c.offsetLeft;
    mouseY = e.pageY - c.offsetTop;

    return [mouseX,mouseY];
  }

  }

  function drawline(x1,y1,x2,y2,w,c)
  {
    //console.log(x1,y1,x2,y2,w,c);
    if (drawturn == 1)
    {
      socket.emit('drawline', [x1,y1,x2,y2,w,c]);
    }

    context.strokeStyle = c;
    context.lineWidth = w;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
  }

  

  

  // Prevent scrolling when touching the canvas
  
  document.body.addEventListener("touchstart", function (e) {
    if (e.target.tagName == 'canvas') {
      e.preventDefault(); } }, false);
  /*
  document.body.addEventListener("touchend", function (e) {
    if (e.target.tagName == 'canvas') {
      e.preventDefault(); } }, false);
  document.body.addEventListener("touchmove", function (e) {
    if (e.target.tagName == 'canvas') {
      touchmovef(e);
      e.preventDefault(); } }, false);
  
*/



  


  // Handle Clear Button
  var clearButton = document.getElementById('clear');

  clearButton.addEventListener('click', function() {
    if (drawturn == 0) return;
    socket.emit('clearcanvas');
    clearcanvas();
  });

  function clearcanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    isDrawing = 0;
  }


  // Handle Save Button
  var saveButton = document.getElementById('save');


  saveButton.addEventListener('click', function() {
  /*
    var imageName = prompt('Please enter image name');
    var canvasDataURL = canvas.toDataURL();
    var a = document.createElement('a');
    a.href = canvasDataURL;
    a.download = imageName || 'drawing';
    a.click();
  */
    drawingturn();
    
  });

  context.font = "30px Arial";
  

  //var socket = io();
  var answered = 0;


  socket.on('answer',function(data){
    if (answered == 0)
    {
      context.fillText(data,10,50);
    answered = 1;
    console.log(data);
    }
    
  });

  socket.on('drawline',function(data){
    drawline(data[0],data[1],data[2],data[3],data[4],data[5]);
  })

  socket.on('clearcanvas',function(){
    clearcanvas();
  })
  
//}