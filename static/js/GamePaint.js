//window.onload = function () {

  // Definitions
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

  //touch event for mobile
  canvas.addEventListener('touchstart', touchstartf,false);
  canvas.addEventListener('touchmove', touchmovef,false);

  function gettouchpos(e){
    if (!e) var e = event;

    var touch = e.touches[0];
    touchX=touch.pageX-touch.target.offsetLeft;
    touchY=touch.pageY-touch.target.offsetTop;
    
    return [touchX,touchY];
  }

  function touchstartf(){
    gettouchpos();
    drawline(touchX-1,touchY,touchX,touchY,linewidth,linecolor);
    event.preventDefault();
  }

  function touchmovef(e){
    var x1 = touchX;
    var y1 = touchY;
    gettouchpos(e);
    drawline(x1,y1,touchX,touchY,linewidth,linecolor);
    event.preventDefault();
  }




  // Handle Mouse Coordinates
  function setMouseCoordinates(e,c) {
    //mouseX = event.clientX - boundings.left;
    //mouseY = event.clientY - boundings.top;
    mouseX = e.pageX - c.offsetLeft;
    mouseY = e.pageY - c.offsetTop;

    return [mouseX,mouseY];
  }

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
  

  var socket = io();
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
  
  

//};