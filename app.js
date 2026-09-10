let deck, playerCards, dealerCards;

function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({suit, value});
    }
  }
  return deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
  if (['J','Q','K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
}

function calculateScore(cards) {
  let score = cards.reduce((sum, card) => sum + getCardValue(card), 0);
  let aces = cards.filter(card => card.value === 'A').length;
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

function renderCards(cards, elementId) {
  const container = document.getElementById(elementId);
  container.innerHTML = '';
  cards.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = card.value + card.suit;
    container.appendChild(div);
  });
}

function updateScores() {
  document.getElementById('player-score').textContent = "Điểm: " + calculateScore(playerCards);
  document.getElementById('dealer-score').textContent = "Điểm: " + calculateScore(dealerCards);
}

function startGame() {
  deck = createDeck();
  playerCards = [deck.pop(), deck.pop()];
  dealerCards = [deck.pop(), deck.pop()];
  renderCards(playerCards, 'player-cards');
  renderCards(dealerCards, 'dealer-cards');
  updateScores();
}

function hit() {
  playerCards.push(deck.pop());
  renderCards(playerCards, 'player-cards');
  updateScores();
  if (calculateScore(playerCards) > 21) {
    document.getElementById('result').textContent = "Bạn thua rồi!";
  }
}

function stand() {
  while (calculateScore(dealerCards) < 17) {
    dealerCards.push(deck.pop());
  }
  renderCards(dealerCards, 'dealer-cards');
  updateScores();

  const playerScore = calculateScore(playerCards);
  const dealerScore = calculateScore(dealerCards);

  if (dealerScore > 21 || playerScore > dealerScore) {
    document.getElementById('result').textContent = "Bạn thắng!";
  } else if (playerScore < dealerScore) {
    document.getElementById('result').textContent = "Cái thắng!";
  } else {
    document.getElementById('result').textContent = "Hòa!";
  }
}

function restart() {
  document.getElementById('result').textContent = "";
  startGame();
}

startGame();
