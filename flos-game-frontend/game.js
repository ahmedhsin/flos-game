import { scene, renderer, camera, raycaster, mouse } from './sceneSetup.js'
import {
setMainCard,
drawingPlayerCards,
playerWinCards,
playerLoseCards,
globalCards,

} from './helpers/cards.js'
let playerIndex = null;
const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

document.getElementById('join').addEventListener('click', ()=>{
    handelClick('join')
})

document.getElementById('create').addEventListener('click', ()=>{
    handelClick('create')
})


function handelClick(value){
    let inputBox = document.getElementById('inputBox');
    let gameCodeInput = document.getElementById('gameCode');
    let btnsDiv = document.querySelector('.btns');
    let status = document.getElementById("status")
    if (value == 'join'){
        joinGame(gameCodeInput.value)
    }else{
        let code = createGame();
        gameCodeInput.value = code;
        let btn1 = document.getElementById('join');
        let btn2 = document.getElementById('create');
        btn1.disabled = true;
        btn2.disabled = true;
        gameCodeInput.disabled = true;
        btnsDiv.style.display = 'none';
        status.innerText = "waiting for the other player"
    }
}
function removeInputBox(){
    let inputBox = document.getElementById('inputBox');
    inputBox.style.display = 'none';
}

function joinGame(code){
    let gameCodeInput = document.getElementById('gameCode');
    let btn1 = document.getElementById('join');
    let btn2 = document.getElementById('create');
    gameCodeInput.disabled = true;
    btn1.disabled = true;
    btn2.disabled = true;
    socket.emit("join game", {id: code})
}
function createGame(){
    let r = (Math.random() + 1).toString(36).substring(5);
    socket.emit("create game", {id: r})
    joinGame(r);
    return r;
}
function gameEnd(state, score){
    let inputBox = document.getElementById('inputBox');
    let gameCodeInput = document.getElementById('gameCode');
    let btnsDiv = document.querySelector('.btns');
    let status = document.getElementById("status")
    let label = document.getElementById('code-lable')
    label.style.display = 'none';
    btnsDiv.style.display = 'none';
    gameCodeInput.style.display = 'none';
    if (state === 'draw'){
        status.innerText = `you draw with ${score[playerIndex]} vs ${score[Number(!playerIndex)]}`
    }
    else if (state === 'win'){
        status.innerText = `you win with ${score[playerIndex]} vs ${score[Number(!playerIndex)]}`
    }else if (state === 'lose'){
        status.innerText = `you lose with ${score[playerIndex]} vs ${score[Number(!playerIndex)]}`
    }else if (state === 'leave'){
        status.innerText = `the other player leave the game`
    }else{
        status.innerHTML = `error: ${score['error']}`
    }
    inputBox.style.display = 'block';
}

socket.on('game leave', () => {
    gameEnd('leave')
    socket.emit('leave')
})
socket.on('update-ui-finish', (winnerIndex, score)=>{
    if (score[0] === score[1])
        gameEnd('draw', score)
    else if (playerIndex === winnerIndex)
        gameEnd('win', score)
    else
        gameEnd('lose', score)
    socket.emit('leave')
})
socket.on("init game", async (data, pIndex) => {
    removeInputBox();
    playerIndex = pIndex;
    if (playerIndex == 1){
        camera.rotation.z = Math.PI
    }
    drawingPlayerCards(data.board, -1, scene)
    const players = data.players;
    const len = players[0].cards.length
    players[0].cards.splice(len-1, 1)
    players[1].cards.splice(len-1, 1)
    await sleep(2000)
    drawingPlayerCards(players[0].cards, 0, scene)
    drawingPlayerCards(players[1].cards, 1, scene)
});
socket.on('error', (err) => {
    if (!('stop' in err))
        gameEnd('error', err)
    else{
        let not = document.getElementById('notification')
        not.innerText = err['error'];
        not.style.display = 'block';
        setTimeout(() => {
            not.style.display = 'none'
        }, 1000)
    }
})

window.addEventListener('click', onClick, false);
function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const card = intersects[0].object
        if (card.name === "card" && card.playerIndex === playerIndex){
            socket.emit('playCard', card.index)
        }
    }
}


socket.on("update-ui-play", async(returnObj) => {
    if (returnObj.status == 'win') {
        playerWinCards(returnObj.playerCard, returnObj.cards, returnObj.playerIndex, returnObj.playerCardIndex);
    } else {
        playerLoseCards(returnObj.playerCard, returnObj.playerCardIndex)
    }
})

socket.on("update-ui-draw", async(dplayers) => {
    const players = dplayers;
    const len = players[0].cards.length
    players[0].cards.splice(len-1, 1)
    players[1].cards.splice(len-1, 1)
    await sleep(2000)
    drawingPlayerCards(players[0].cards, 0, scene)
    drawingPlayerCards(players[1].cards, 1, scene)
})


