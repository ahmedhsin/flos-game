import * as gameLogic from './gameLogic.js';

const sessions = {}

function createGameSession(id){
    sessions[id] = {
        cards: [],
        board: [],
        players: [
            {
                cards: [],
                score: 0
            },
            {
                cards: [],
                score: 0
            }
        ],
        turn: 0
    }
}
export default (io, socket) => {
    socket.on('connect', ()=>{
        console.log('user is connected')
    })
    socket.on('create game', (data) => {
        const { id } = data;
        if (id in sessions){
            socket.emit('error', {error: "game Already exitst"})
        }
        createGameSession(id);
    })
    socket.on('join game', (data) => {
        const { id } = data
        const roomPopulation = io.sockets.adapter.rooms.has(id)
        ? io.sockets.adapter.rooms.get(id).size
        : 0;
        if (id === undefined){
            socket.emit('error', {error :'id is not valid'});
        }else if (!(id in sessions)){
            socket.emit('error', {error :'wrong code'});
        }
        else if (roomPopulation == 0){
            socket.join(id);
            socket.gameId = id;
            socket.playerIndex = 0;
        }else if (roomPopulation < 2){
            socket.join(id);
            socket.gameId = id;
            //rem if first player leave then join
            socket.playerIndex = 1;
            const game = initGame(sessions[id], socket.playerIndex);
            const socketsInRoom = io.sockets.adapter.rooms.get(id);
            socketsInRoom.forEach((socketId) => {
                let nwGame= JSON.parse(JSON.stringify(game))
                let playerIndex = null;

                if (socketId === socket.id){
                    nwGame.players[0].cards = coverCards();
                    playerIndex = 1;
                }else{
                    nwGame.players[1].cards = coverCards();
                    playerIndex = 0;
                }
                delete nwGame.cards;
                io.to(socketId).emit('init game', nwGame, playerIndex)
            });
        }else{
            socket.emit('error', {error :'room is full'});
        }
    })


    socket.on('disconnect', () => {
        socket.leave(socket.gameId);
        io.to(socket.gameId).emit('game leave')
        delete sessions[socket.gameId]
    });
    socket.on('leave', ()=>{
        socket.leave(socket.gameId);
    })

    socket.on('playCard', (playerCardIndex) => {
        const gameSession = sessions[socket.gameId];
        if (gameSession.turn === socket.playerIndex 
            && playerCardIndex < gameSession.players[socket.playerIndex].cards.length){

            const ret = playerPlay(gameSession, socket.playerIndex, playerCardIndex)
            io.to(socket.gameId).emit('update-ui-play', ret);
            const players = gameSession.players;
            const len = players[0].cards.length
            if (players[0].cards[len - 1] <= 0 && players[1].cards[len - 1] <= 0){
                if (gameSession.cards.length == 0){
                    let winnerIndex = 0;
                    if (players[0].score > players[1].score){
                        winnerIndex = 0
                    }else if (players[0].score < players[1].score){
                        winnerIndex = 1;
                    }else{
                        winnerIndex = 0;
                    }
                    io.to(socket.gameId).emit('update-ui-finish', winnerIndex,[players[0].score, players[1].score]);
                }else{
                    const players1 = addPlayersCards(gameSession);
                    const socketsInRoom = io.sockets.adapter.rooms.get(socket.gameId);
                    socketsInRoom.forEach((socketId) => {
                        let playersCards = JSON.parse(JSON.stringify(players1))
                        let playerIndex = null;

                        if (socketId === socket.id) {
                            playersCards[0].cards = coverCards();
                            playerIndex = 1;
                        } else {
                            playersCards[1].cards = coverCards();
                            playerIndex = 0;
                        }
                        io.to(socketId).emit('update-ui-draw', playersCards);
                    })
                }
            }
        }else{
            socket.emit('error', {error :'not your turn',stop: false});
        }
    })
}

function coverCards (){
    return ['red_back', 'red_back', 'red_back', 'red_back', 4];
}
function initGame(gameSession, playerIndex){
    gameSession.cards = gameLogic.generateCards();
    gameLogic.drawingCards(gameSession.cards, gameSession.board, 4, 'board')
    gameLogic.shuffleCards(gameSession.cards)
    addPlayersCards(gameSession, playerIndex)
    return gameSession;
}


function addPlayersCards(gameSession, playerIndex){
    for (let i = 0;i < gameSession.players.length; i++){
        gameSession.players[i].cards.splice(0);
        gameLogic.drawingCards(gameSession.cards, gameSession.players[i].cards, 4, 'player')
    }
    const players = JSON.parse(JSON.stringify(gameSession.players))
    //players[Number(!playerIndex)].cards = ['red_back', 'red_back', 'red_back', 'red_back', 4]
    return players;
}

function playerPlay(gameSession, playerIndex, playerCardIndex){
    if (playerIndex != gameSession.turn){
        return {error: 'its not your turn', stop: false};
    }
    const player = gameSession.players[playerIndex];
    if (player.cards[player.cards.length - 1] <= 0){
        return {error: 'wrong card'}
    } 
    const playerCard = gameSession.players[playerIndex].cards[playerCardIndex];
    const returnObj = gameLogic.playCard(gameSession.board, gameSession.players[playerIndex], playerCardIndex)
    returnObj.playerCardIndex = playerCardIndex;
    returnObj.playerCard = playerCard;
    returnObj.playerIndex = playerIndex;
    gameSession.turn = Number(!gameSession.turn)
    return returnObj;
}