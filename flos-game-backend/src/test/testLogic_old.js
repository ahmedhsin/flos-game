import * as gameLogic from '../gameLogic.js'
import * as chai from 'chai';

describe("test cards", function() {
  it("check generate cards length", function() {
    chai.expect(gameLogic.generateCards().length).to.eql(52)
  });
  it("check the shuffle method", function() {
    const cardsBefore = gameLogic.generateCards();
    const shuffledCards = gameLogic.shuffleCards(gameLogic.generateCards());
    chai.expect(cardsBefore).to.not.deep.equal(shuffledCards);
  })
  it("check player drawing", function() {
    const cards = gameLogic.generateCards();
    const firstCards = cards.slice(0, 5);
    const player = []
    gameLogic.drawingCards(cards, player, 5, 'player')
    chai.expect(player.length).to.be.eql(5)
    chai.expect(cards.slice(0, 5)).to.not.deep.equal(player);
    chai.expect(firstCards).to.deep.equal(player);
  })
  it("check getNum", function() {
    chai.expect(5).to.be.eql(gameLogic.getCardNum('5C'))
    chai.expect('J').to.be.eql(gameLogic.getCardNum('JC'))
    chai.expect(10).to.be.eql(gameLogic.getCardNum('10C'))
  })
  
  it("check board drawing", function() {
    const cards = gameLogic.generateCards();
    const board = []
    gameLogic.drawingCards(cards, board, 5, 'board')
    chai.expect(board.length).to.be.eql(5)
    const set = new Set()
    board.forEach((ele) => {
        set.add(gameLogic.getCardNum(ele));
    })
    chai.expect(set.size).to.be.eql(5);
    let uniqueCards2 = new Set(cards.map(card => gameLogic.getCardNum(card)));
    chai.expect(uniqueCards2.size).to.be.eql(13)
})
  it("check the game logic 1", function() {
    const player = {cards : ['1C', 'QD', '4D', '10C'], score: 0}
    const board = ['2C', 'JD', '7H', '8C']
    gameLogic.playCard(board, player, 0)
    chai.expect(board.length).be.eql(5)
    chai.expect(player.cards.length).be.eql(3)
    chai.expect(player.score).be.eql(0)
    
  })
  it("check the game logic 2", function() {
    const player = {cards : ['1C', 'QD', '4D', '10C'], score: 0}
    const board = ['2C', 'JD', '1H', '8C']
    gameLogic.playCard(board, player, 0)
    chai.expect(board.length).be.eql(3)
    chai.expect(player.cards.length).be.eql(3)
    chai.expect(player.score).be.eql(2)
    
  })
  it("check the game logic 3", function() {
    const player = {cards : ['5C', 'QD', '4D', '10C'], score: 0}
    const board = ['5C', '4D', '1H', '8C']
    gameLogic.playCard(board, player, 0)
    chai.expect(board.length).be.eql(1)
    chai.expect(player.cards.length).be.eql(3)
    chai.expect(player.score).be.eql(4)
    
  })
  it("check the game logic 4", function() {
    const player = {cards : ['JC', 'QD', '4D', '10C'], score: 0}
    const board = ['5C', '4D', '1H', '8C']
    gameLogic.playCard(board, player, 0)
    chai.expect(board.length).be.eql(0)
    chai.expect(player.cards.length).be.eql(3)
    chai.expect(player.score).be.eql(5)
    
  })
  it("check the game logic 4", function() {
    const player = {cards : ['10C', 'QD', '4D', '10C'], score: 0}
    const board = ['5C', '4D', '3H', '2C','1C']
    gameLogic.playCard(board, player, 0)
    chai.expect(board.length).be.eql(1)
    chai.expect(player.cards.length).be.eql(3)
    chai.expect(player.score).be.eql(5)
    
  })
  it("check the game logic 5", function() {
    const player = {cards : ['6C', 'QD', '4D', '10C'], score: 0}
    const board = ['5C', '1D', '3H', '2C']
    gameLogic.playCard(board, player, 0)
    chai.expect(board.length).be.eql(1)
    chai.expect(player.cards.length).be.eql(3)
    chai.expect(player.score).be.eql(4)
  })
  it("check the game logic 6", function() {
    const player = {cards : ['QC', 'QD', '4D', '10C'], score: 0}
    const board = ['5C', '4D', 'QH', '2C','1C']
    gameLogic.playCard(board, player, 0)
    chai.expect(board.length).be.eql(4)
    chai.expect(player.cards.length).be.eql(3)
    chai.expect(player.score).be.eql(2)
    
  })




  it("check the game logic for retu 1", function() {
    const player = {cards : ['1C', 'QD', '4D', '10C'], score: 0}
    const board = ['2C', 'JD', '7H', '8C']
  
    const ret = gameLogic.playCard(board, player, 0)
    chai.expect(ret.cards).to.deep.equal([]);
    
  })
  it("check the game logic for retu 2", function() {
    const player = {cards : ['1C', 'QD', '4D', '10C'], score: 0}
    const board = ['2C', 'JD', '1H', '8C']
    const ret = gameLogic.playCard(board, player, 0)
    chai.expect(ret.cards).to.deep.equal(['1H']);
    chai.expect(board.length).be.eql(3)
    chai.expect(player.cards.length).be.eql(3)
    chai.expect(player.score).be.eql(2)
    
  })
  it("check the game logic for retu 3", function() {
    const player = {cards : ['5C', 'QD', '4D', '10C'], score: 0}
    const board = ['5C', '4D', '1H', '8C']
    const ret = gameLogic.playCard(board, player, 0)
    chai.expect(ret.cards).to.deep.equal(['4D', '1H', '5C']);
    chai.expect(board.length).be.eql(1)
    chai.expect(player.cards.length).be.eql(3)
    chai.expect(player.score).be.eql(4)
    
  })
  it("check the game logic for retu 4", function() {
    const player = {cards : ['JC', 'QD', '4D', '10C'], score: 0}
    const board = ['5C', '4D', '1H', '8C']
    const ret = gameLogic.playCard(board, player, 0)
    chai.expect(ret.cards).to.deep.equal(['5C', '4D', '1H', '8C']);
    chai.expect(board.length).be.eql(0)
    chai.expect(player.cards.length).be.eql(3)
    chai.expect(player.score).be.eql(5)
    
  })
  it("check the game logic for retu 4", function() {
    const player = {cards : ['10C', 'QD', '4D', '10C'], score: 0}
    const board = ['5C', '4D', '3H', '2C','1C']
    const ret = gameLogic.playCard(board, player, 0)
    chai.expect(ret.cards).to.deep.equal(['4D', '3H', '2C','1C']);
    chai.expect(board.length).be.eql(1)
    chai.expect(player.cards.length).be.eql(3)
    chai.expect(player.score).be.eql(5)
    
  })
  it("check the game logic for retu 5", function() {
    const player = {cards : ['6C', 'QD', '4D', '10C'], score: 0}
    const board = ['5C', '1D', '3H', '2C']
    const ret = gameLogic.playCard(board, player, 0)
    chai.expect(ret.cards).to.deep.equal(['1D', '3H', '2C']);
    chai.expect(board.length).be.eql(1)
    chai.expect(player.cards.length).be.eql(3)
    chai.expect(player.score).be.eql(4)
  })
  it("check the game logic for retu 6", function() {
    const player = {cards : ['QC', 'QD', '4D', '10C'], score: 0}
    const board = ['5C', '4D', 'QH', '2C','1C']
    const ret = gameLogic.playCard(board, player, 0)
    chai.expect(ret.cards).to.deep.equal(['QH']);
    chai.expect(board.length).be.eql(4)
    chai.expect(player.cards.length).be.eql(3)
    chai.expect(player.score).be.eql(2)
    
  })
});