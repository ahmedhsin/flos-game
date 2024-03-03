import * as THREE from 'three'
import gsap from 'gsap'
import { renderer } from '../sceneSetup.js';
import {mainCardPosition, playersPositions, boardPositions, playerRepo} from './positions.js'
const globalCards = {}
function createCard(width, height, cardNum, index) {
  const frontTexture = new THREE.TextureLoader().load(`static/cards/${cardNum}.png`);
  const backTexture = new THREE.TextureLoader().load('static/cards/purple_back.png');
  frontTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  backTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()

  const boxGeometry = new THREE.BoxGeometry(width, height, 0.00001);
  const materials = [
  new THREE.MeshBasicMaterial(),
  new THREE.MeshBasicMaterial(),
  new THREE.MeshBasicMaterial(),
  new THREE.MeshBasicMaterial(),
  new THREE.MeshBasicMaterial({ map: frontTexture }),
  new THREE.MeshBasicMaterial({ map: backTexture}),
  ];

  const card = new THREE.Mesh(boxGeometry, materials);
  if (cardNum == 'red_back'){
    globalCards[cardNum+index] = card;
  }else{
    globalCards[cardNum] = card;
  }
  card.name = "card"
  return card
}
function changeTexture(card, cardNum){
  const frontTexture = new THREE.TextureLoader().load(`static/cards/${cardNum}.png`);
  const backTexture = new THREE.TextureLoader().load(`static/cards/red_back.png`);
  frontTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  backTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  card.material[4] = new THREE.MeshBasicMaterial({ map: frontTexture });
  card.material[5] = new THREE.MeshBasicMaterial({ map: backTexture });

}
function generateCards() {
  /*cards will be generate in form of 2C 2D .. JC JD */
  const cards = []
  function generateTypes(card) {
      return [card + 'C', card + 'D', card + 'H', card + 'S']
  }
  for (let i = 1; i <= 10; i++) {
      cards.push(...generateTypes(i.toString()))
  }
  cards.push(...generateTypes('J'))
  cards.push(...generateTypes('K'))
  cards.push(...generateTypes('Q'))
  return cards;
}
function resetPosition(card){
  for (let i = 0;i < boardPositions.length; i++){
    if (card.position.x === boardPositions[i].pos.x && 
      card.position.y === boardPositions[i].pos.y  &&
      card.position.z === boardPositions[i].pos.z ){
      boardPositions[i].isFree = true;
      break;
    }
  }
}

function playerWinCards(card, cards, playerIndex, cardIndex){
  const cardObj = globalCards[getCard(card, cardIndex)];
  const cardsObj = cards.map((ca) => globalCards[ca]);
  cardsObj.forEach((ca) => {
    resetPosition(ca)
  })
  winingCards(cardObj, cardsObj);
  setTimeout(() => {
      winingRepo([cardObj, ...cardsObj], playerRepo[playerIndex])
  }, 1500)
}
function getCard(card, cardIndex){
  if (!(card in globalCards)){
    const cardnum = 'red_back'+cardIndex;
    const cardObject = globalCards[cardnum]
    delete globalCards[cardnum];
    globalCards[card] = cardObject;
    setTimeout(()=>{
      changeTexture(cardObject, card);
    }, 250)
  }
  return card;
}

function playerLoseCards(card, cardIndex){
  const cardObj = globalCards[getCard(card, cardIndex)];
  cardObj.isAvailable = false;
  for (let i = 0;i < boardPositions.length; i++){
    if (boardPositions[i].isFree){
      boardPositions[i].isFree = false;
      drawingCardAnimation(cardObj, boardPositions[i].pos, false);
      break;
    }
  }
}

function drawingPlayerCards(cards, playerIndex, scene){
  for (let i = 1; i <= cards.length; i++){
    const card = createCard(3, 6, cards[i-1], i-1);
    card.position.copy(mainCardPosition);
    card.index = i-1;
    card.playerIndex = playerIndex
    if (playerIndex >= 0)
      card.isAvailable = true;
    scene.add(card)
    setTimeout(() => {
      let position = null;
      if (playerIndex >= 0){
        position = playersPositions[playerIndex][i-1]
      }else{
        position = boardPositions[i-1].pos;
        boardPositions[i-1].isFree = false
      }
      drawingCardAnimation(card, position)
    }, 500*i)
  }
}

function setMainCard(scene) {
  const card = createCard(4, 8, 'purple_back')
  card.position.copy(mainCardPosition);
  card.position.z += 0.001
  card.isAvailable = false;
  scene.add(card)
  return card;
}

function winingCards(card, cards){
  drawingCardAnimation(card, {x:0,y:0,z:9}, false)
  card.isAvailable = false;
  for (let i = 0;i < cards.length; i++){
      cards[i].isAvailable = false
      const pos = boardPositions[i+1].pos;
      const newPos = {x:pos.x, y:0, z:9}
      drawingCardAnimation(cards[i], newPos, false);
  }

}


function winingRepo(cards, pos){
  for(let i = 0;i < cards.length; i++){
    cards[i].rotation.z = Math.PI/2
    drawingCardAnimation(cards[i], pos, false)
  }
}


function drawingCardAnimation(card, position, rot){
  const t1 = new gsap.timeline({
    defaults: {duration: 0.4, delay: 0.1}
  })
  let sy = Math.PI;
  if (!rot) sy = 0;
  t1.to(card.rotation, {
    y: sy,
  })
  .to(card.position, {
    x: position.x,
    y: position.y,
    z: position.z
  }, 0)
}


export {
  createCard,
  winingCards,
  winingRepo,
  setMainCard,
  drawingCardAnimation,
  drawingPlayerCards,
  globalCards,
  playerWinCards,
  playerLoseCards,
  generateCards
}