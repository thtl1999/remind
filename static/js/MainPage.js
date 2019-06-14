var socket = io()
var charaNum = 5;
var size=3;

/* 접속 되었을 때 실행 */
socket.on('connect', function() {

  var name = '익명';
  /* 서버에 새로운 유저가 왔다고 알림 */
  socket.emit('newUser', name)

})

// 서버로부터 페이지 업데이트 명령
socket.on('nextPage', function(data) {
  location.href =  data.url;

}) 

// 방만들기 버튼 클릭
function makeLobby() {
  socket.emit('makeLobby', charaNum);
  //location.href = "/client/MakeRoom.html";
}



// 시작 버튼 클릭
function fastStart() {
  socket.emit('fastStart', charaNum);
}



// 캐릭터 변경 화살표 버튼 클릭
function changeCharacter() {

}

