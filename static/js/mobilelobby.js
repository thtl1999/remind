var socket = io()
var ishost = 0;
var roomsid = 0;
var charaNum = 5;
var playerName = "";

socket.on('connect', function() {
  socket.emit('newUser_MakeRoom')
});

socket.on('init_MakeRoom', function(data) {
  ishost = data.ishost;
  roomsid = data.roomsid;
  charaNum = data.charaNum;
  playerName = data.playerName;
//  refreshCharacter();
});


function copyadd() {
  /* Get the text field */
  var copyText = document.getElementById("txtbox");

  /* Select the text field */
  copyText.select();

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
//  alert("Copied the text: " + copyText.value);
}

var roundt = 1;
var timet = 30;

function roundf(v){
    if(!ishost)
        return
    var myvalue = roundt + v;
    if (myvalue < 1 || myvalue > 10)
        return;
    var roundv = document.getElementById("roundv");
    roundv.innerHTML = String(myvalue);
    roundt = myvalue;
    
    socket.emit('update_MakeRoom', {proundNumber: String(roundt)});
}

function timef(v){
    if(!ishost)
        return
    var myvalue = timet + v;
    if (myvalue < 20 || myvalue > 100)
        return;
    var timev = document.getElementById("timev");
    timev.innerHTML = String(myvalue);
    timet = myvalue;
    
    socket.emit('update_MakeRoom', {ptimeToDraw: String(timet)});
}

/* 서버로부터 데이터 받은 경우 */
socket.on('update_MakeRoom', function(data) {
  if(data.proundNumber)
    document.getElementById("roundv").innerHTML = data.proundNumber
  if(data.ptimeToDraw)
    document.getElementById("timev").innerHTML = data.ptimeToDraw

});

/* 시작 함수 */
function start() {
  if(!ishost)
    return
  socket.emit('start', {maxRound: roundt, maxTime: timet});
}

socket.on('startLobby', function(data) {
  location.href = '../Game/' + data;
})

socket.on('wrongAccess', function() {
  console.log('wrongAccess');
  location.href = '../';
})

document.getElementById('txtbox').value = document.URL;