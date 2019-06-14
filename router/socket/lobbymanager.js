var GameLobby = require('./gamelobby');

function LobbyManager(socketio, word) {
	var self = this;

	self.gameLobbys = {};
	self.io = socketio;
	self.word = word;

}

//require(앤서)
var allanswers = {};

function pickanswer(allanswers){
	//ppick 100 answers
	answer = 0;

	[
		{
			word: 'myanswer',
			simil: 'notword'
		},
		{
			
		}
	]

	return answer;
}

// 로비 생성 함수
LobbyManager.prototype.makeLobby = function(socket) {
	var self = this;


	//answers = getanswewrs()

	// gamelobby 객체 생성
	let gamelobby = new GameLobby({	//lobbyPW: info.PW, 
									host: socket.handshake.sessionID,
									socket: socket,
									io: self.io,
									word: self.word.Getwords(100)
									});

	console.log('make lobby!! ' + gamelobby.host );
	// socket 룸 연결
	socket.join(gamelobby.host);
	//gamelobby.on('response', self.lobbyChatResponse.bind(self));

	self.gameLobbys[gamelobby.host] = gamelobby;	


}

// 로비 참가 함수
LobbyManager.prototype.joinLobby = function(socket, sessionID) {
	var self = this;
	var targetLobby = self.gameLobbys[sessionID]

	// 로비가 존재하지 않음
	if(!targetLobby) {
		console.log('lobby not find!!');
		socket.emit('wrongAccess');
		return -1;
	}

	/*
	// 로비 상태 검사
	if(targetLobby.state == State.STATES.PLAY){
		console.log('lobby aleady started!!');
		return -1;
	}*/

	console.log('join lobby!! ' + sessionID);

	// socket 룸 연결
	socket.join(sessionID);

	targetLobby.joinUser(socket, sessionID);

}

// 로비 빠른 참가가 가능한가 (fastStart에서 호출)
LobbyManager.prototype.canJoinLobby = function() {
	var self = this;

	for(var i in self.gameLobbys) {
		var lobby = self.gameLobbys[i]
		if(lobby.canJoin())
			return i;
	}

	return 0;
}

// 로비 시작 함수
LobbyManager.prototype.startLobby = function(sessionID, option) {
	var self = this;
	var lobby = self.gameLobbys[sessionID]
	lobby.initGame(option.maxRound, option.maxTime)
}

// 로비 시작 함수
LobbyManager.prototype.startLobby2 = function(sessionID) {
	var self = this;
	var lobby = self.gameLobbys[sessionID]
	lobby.nextRound();
}


module.exports = LobbyManager;