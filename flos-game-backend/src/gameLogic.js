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

function getCardNum(card) {
    if (card[0].charCodeAt() >= 49 && card[0].charCodeAt() <= 58) {
        if (card.length == 3) {
            return parseInt(card.slice(0, 3))
        }
        return parseInt(card[0])
    }
    return card[0]
}

function shuffleCards(cards) {
    return cards.sort((a, b) => 0.5 - Math.random());
}

function drawingCards(cards, bpCards, num, type) {
    if (cards.length < num) {
        throw Error('there no enough cards to draw from')
    }
    let deck = cards.slice(0, num)
    if (type == 'board') {
        while (true) {
            const uniqueCards = Array.from(new Set(deck.map(card => getCardNum(card))));
            if (uniqueCards.length == num) break;
            shuffleCards(cards)
            deck = cards.slice(0, num)
        }
    }
    cards.splice(0, num)
    bpCards.push(...deck)
    if (type == 'player'){
        bpCards.push(num);
    }
}

function findCombinations(numbers, target) {
    let result = [];
    let resultSet = new Set();

    function backtrack(start, currentCombination, currentSum) {
        if (currentSum === target) {
            const sortedCombination = [...currentCombination].sort((a, b) => a - b);
            const combinationString = sortedCombination.join(',');

            if (!resultSet.has(combinationString)) {
                resultSet.add(combinationString);
                result.push([...currentCombination]);
            }
            return;
        }

        for (let i = start; i < numbers.length; i++) {
            let num = numbers[i];
            if (currentSum + num <= target) {
                currentCombination.push(num);
                backtrack(i + 1, currentCombination, currentSum + num);
                currentCombination.pop();
            }
        }
    }

    backtrack(0, [], 0);
    return result;
}

function sortCombinations(combinations) {
    return combinations.sort((a, b) => b.length - a.length);
}


function playCard(board, player, cardIndex) {
    if (cardIndex === undefined) {
        throw Error('wrong card index to play')
    }
    const returnObj = {
        status: '', cards: []
    }
    const card = player.cards[cardIndex];
    const cardNum = getCardNum(player.cards[cardIndex]);
    delete player.cards[cardIndex];
    player.cards[player.cards.length - 1] -= 1;
    /*if card is J */
    if (cardNum == 'J') {
        if (board.length > 0) {
            player.score += 1 + board.length
            returnObj.status = 'win'
            returnObj.cards = [...board]
            board.splice(0);

        } else {
            returnObj.status = 'lose'
            board.push(card)
        }
        return returnObj;
    }
    /* */
    const cardsOnBoard = {};
    board.forEach((card, index) => {
        const cardN = getCardNum(card);
        if (cardsOnBoard[cardN] === undefined) {
            cardsOnBoard[cardN] = [index]
        } else {
            cardsOnBoard[cardN].push(index);
        }
    })
    /*in case of k or q */
    if (cardNum === 'K' || cardNum === 'Q') {
        const choosenCardsIndices = cardsOnBoard[cardNum];

        if (choosenCardsIndices && choosenCardsIndices.length) {
            player.score += 1 + choosenCardsIndices.length
            const winningCards = []
            choosenCardsIndices.forEach((cardIndex) => {
                winningCards.push(board[cardIndex])
                board.splice(cardIndex, 1);
            })
            returnObj.status = 'win'
            returnObj.cards = winningCards;
        } else {
            returnObj.status = 'lose'
            board.push(card);
        }
        return returnObj;
    }
    /* */
    /*in case its a number */

    let choosenCardsIndices = []
    const allCardsNum = []
    board.forEach((ele) => {
        allCardsNum.push(getCardNum(ele));
    })

    const combinations = sortCombinations(findCombinations(allCardsNum, cardNum));
    if (combinations.length == 0) {
        board.push(card);
        returnObj.status = 'lose'
        return returnObj;
    }
    for (let i = 0; i < combinations.length; i++) {
        let chossen = []
        for (let j = 0; j < combinations[i].length; j++) {
            let currentFree = cardsOnBoard[combinations[i][j]]
            if (currentFree.length > 0) {
                chossen.push(currentFree.pop())
            }
        }
        if (chossen.length === combinations[i].length) {
            choosenCardsIndices.push(...chossen);
        }
    }
    const choosenCardsAc = []
    choosenCardsIndices.forEach((idx) => {
        choosenCardsAc.push(board[idx])
    })
    choosenCardsAc.forEach((ele) => {
        const idx = board.indexOf(ele);
        board.splice(idx, 1);
    })
    player.score += choosenCardsIndices.length + 1;
    returnObj.status = 'win'
    returnObj.cards = choosenCardsAc;
    return returnObj;
    /* */
}

export {generateCards, getCardNum, drawingCards, shuffleCards, playCard}