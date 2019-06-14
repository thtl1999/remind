var State = require('./gamestates');

function GameLobby(info) {
	var self  = this;

	//self.lobbyPW = info.lobbyPW;
	self.host = info.host;
	self.io = info.io
	self.gameInterval = 0;

	self.players = [info.host, null, null, null, null, null];
	self.playerNames = [null, null, null, null, null, null];
	self.charaNums = [null, null, null, null, null, null];
	self.sockets = [info.socket, null, null, null, null, null];
	self.scores = [0, -1, -1, -1, -1, -1];

	self.mineplag = 0;

	self.words = info.word;
    self.answer = '';
    self.mine = '';

	self.drawerNum = 0;
	self.drawer = null;

	self.state = State.STATES.INIT;

	self.maxRound = 0;
	self.maxTime = 0;

	self.roundNum = 0;
	self.timeNum = 0;

	self.changeState = function(state) {
		self.state = state;
	}

	//self.players[0] = info.host;

}


//Game 초기화, 프론트엔드에서 Game.html을 로드할때 처음 한번 실행
GameLobby.prototype.initGame = function(maxRound, maxTime) {
	var self = this;

	self.changeState(State.STATES.READY);
	self.maxRound = maxRound;
	self.maxTime = maxTime;
	self.timeNum = self.maxTime;
	self.roundNum = 0;
	self.drawerNum = -1;
	self.drawer = null;

	for(var i = 0 ; i < 6 ; i++) {
		if(self.players[i])
			self.scores[i] = 0;
		else
			self.scores[i] = -1;
	}

	if(self.gameInterval)
		clearInterval(self.gameInterval);

}


//다음 라운드 Game, 시간이 다 되면 or 정답 시 호출
GameLobby.prototype.nextRound = function() {
	var self = this;

	self.timeNum = self.maxTime;
	self.roundNum++;
	self.answer = self.words[self.roundNum].word	    // 단어
	self.mine = self.words[self.roundNum].similar[0]	// 나중에 변경 필요
	self.drawerNum = self.nextDrawer();
	self.drawer = self.players[self.drawerNum];
	self.mineplag = 0;
	self.changeState(State.STATES.PLAY);

	if(self.gameInterval)
		clearInterval(self.gameInterval);

	console.log(self.host + "'s Game: " + self.roundNum + "round start");

	self.io.sockets.to(self.host).emit('update_Game_round', self.roundNum);
	if(self.sockets[self.drawerNum]) {
		self.io.to((self.sockets[self.drawerNum]).id).emit('update_Game_round_yourdrawturn', {	
			answerword: self.answer,
			mineword: self.mine
		});
	}
	else
		self.endedGame();
	self.io.sockets.to(self.host).emit('update_Game_round_inform', self.drawerNum);
	self.io.sockets.to(self.host).emit('clearcanvas', self.roundNum);

	function gameLoop() {
	
		if(self.timeNum < 1) {
			clearInterval(self.gameInterval);
			
			self.io.sockets.to(self.host).emit('update_Game_end', {
				answerword: self.answer, 
				mineword: self.mine
			});
			setTimeout(function(){
				self.stopRound()
			}, 4000);
		}
		
		self.io.sockets.to(self.host).emit('update_Game_timer', self.timeNum);
		//console.log("Tick..." + self.timeNum);
		self.timeNum--;
	}

	setTimeout(function(){
		self.gameInterval = setInterval(gameLoop.bind(self), 1000);
	}, 4000);
}

// 다음 drawer의 번호를 계산하여 반환
GameLobby.prototype.nextDrawer = function() {
	var self = this;
	var nextDrawerNum = (self.drawerNum + 1)%6;

	// 단순하게 (최근번호+1)%(플레이어 수)를 반환하는 결과와 비슷
	// 플레이어 수는 중간에 나가는 플레이어로 인해 유동적이기 때문
	while(self.players[nextDrawerNum] == null) {
		nextDrawerNum = (nextDrawerNum + 1) % 6
		if(nextDrawerNum == self.drawerNum)	// 검색 도중 이전 drawer를 반환하는 경우(정상적이지 않은 게임 흐름)
			return -1
	}	

	return nextDrawerNum;
}

//정답 확인 함수, app.js에서 전송받은 message가 답인지 확인할 때 호출
GameLobby.prototype.isAnswer = function(message) {
	var self = this;

	//게임중이 아니라면 무시
	if(self.state != State.STATES.PLAY)
		return 0;
	return (message == self.answer);
}

//지뢰 확인 함수, app.js에서 전송받은 message가 지뢰인지 확인할 때 호출
GameLobby.prototype.isMine = function(message) {
	var self = this;

	//게임중이 아니라면 무시
	if(self.state != State.STATES.PLAY)
		return 0;
	//지뢰가 터진적이 있다면 무시
	if(self.mineplag)
		return 0;
	return (message == self.mine);
}

//점수 증가 함수 정답시 호출
GameLobby.prototype.incScore = function(player) {
	var self = this;
	self.changeState(State.STATES.STOP);

	for(var i = 0 ; i < 6 ; i++) {
		if(self.players[i] == player) {
			self.scores[i] += 100;
			self.scores[self.drawerNum] += 100
			//console.log(self.scores);
			self.io.sockets.to(self.host).emit('update_Game_score', self.scores);

			self.io.sockets.to(self.host).emit('update_Game_score_inform', {
				drawerNum: self.drawerNum,
				answerNum: i,
				answer: self.answer
			});

			if(self.gameInterval)
				clearInterval(self.gameInterval);

			setTimeout(function(){
				self.stopRound()		// 정답을 맞춘 사람이 있으므로 다음 라운드
			}, 4000);
			return;
		}
	}
}

//트위치/유튜브가 정답시 호출
GameLobby.prototype.sameScore = function(data) {
	var self = this;
	self.changeState(State.STATES.STOP);

	self.scores[self.drawerNum] += 100
	self.io.sockets.to(self.host).emit('update_Game_score', self.scores);
	self.io.sockets.to(self.host).emit('update_Game_score_inform3', {
		name: data,
		drawerNum: self.drawerNum,
		answer: self.answer
	});

	if(self.gameInterval)
		clearInterval(self.gameInterval);

	setTimeout(function(){
		self.stopRound()		// 정답을 맞춘 사람이 있으므로 다음 라운드
	}, 4000);

}

//점수 감소 함수 지뢰시 호출
GameLobby.prototype.decScore = function(player) {
	var self = this;

	for(var i = 0 ; i < 6 ; i++) {
		if(self.players[i] == player) {
			self.scores[self.drawerNum] -= 50
			//console.log(self.scores);
			self.io.sockets.to(self.host).emit('update_Game_score', self.scores);

			self.io.sockets.to(self.host).emit('update_Game_score_inform2', {
				drawerNum: self.drawerNum,
				mineNum: i,
				mine: self.mine
			});

			self.mineplag = 1;
			return;
		}
	}
}

//한 라운드 종료시 호출
GameLobby.prototype.stopRound = function() {
	var self = this;
	self.changeState(State.STATES.STOP);

	if(self.gameInterval)
		clearInterval(self.gameInterval);

	if(self.roundNum >= self.maxRound )
		self.endedGame();
	else
		self.nextRound();
}

//모든 라운드의 Game 끝
GameLobby.prototype.endedGame = function() {
	var self = this;

	if(self.gameInterval)
		clearInterval(self.gameInterval);

	self.changeState(State.STATES.INIT);

	self.io.sockets.to(self.host).emit('ended_Game', self.host);
}


// lobby와 user 관리 함수

GameLobby.prototype.joinUser = function(socket, PW) {
	var self = this;
	var sid = socket.handshake.sessionID

	socket.join(PW);
	for(var i in self.players) {
		// 이미 입력된 players
		if(self.players[i] == sid)
			return;
		if(!self.players[i]) {
			self.players[i] = sid;
			self.sockets[i] = socket;
			self.scores[i] = 0;
			console.log(self.players);
			return;
		}
	}

}

GameLobby.prototype.leaveUser = function(socket, sid) {
	var self = this;

	for(var i in self.players) {
		if(self.players[i] == sid) {
			self.players[i] = null;
			self.sockets[i] = null;
			self.scores[i] = -1;
			socket.leave(self.host);
			console.log("도망자 처단 완료.");
			console.log(i);
			self.io.sockets.to(self.host).emit('update_disconnect', Number(i));
			return;
		}
	}
}

// MakeRoom -> Game 페이지로 옮겼을 경우 player에 해당하는 socket을 재지정해서 연결
GameLobby.prototype.reconnectSocket = function(socket) {
	var self = this;
	var sid = socket.handshake.sessionID;

	for(var i in self.players) {
		if(self.players[i] == sid) {
			self.sockets[i] = socket;
			return;
		}
	}
}

// sid로 player의 번호를 찾아내 호출
GameLobby.prototype.playerNum = function(sid) {
	var self = this;

	for(var i in self.players) 
		if(self.players[i] == sid) 
			return Number(i)+1;
	return 0;
}


// 해당 로비에 사람이 참가할 수 있는 상황인가
GameLobby.prototype.canJoin = function() {
	var self = this;
	if(self.state != State.STATES.INIT)
		return 0;
	for(var i = 0 ; i < 6 ; i++) {
		if(self.players[i] == null)
			return 1;
	}
	return 0;
}

module.exports = GameLobby;