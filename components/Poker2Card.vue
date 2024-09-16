<template>
    <div class="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">2 Card Poker</h1>
    <div v-if="!gameStarted" class="space-y-4">
      <div class="flex items-center space-x-2">
        <label class="text-gray-700 font-medium">
          Bet Amount:
          <input v-model.number="betAmount" type="number" min="1" class="ml-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
      </div>
      <button @click="startGame" :disabled="!betAmount" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed">
        Start Game
      </button>
    </div>
    <div v-else class="space-y-6">
      <div class="flex justify-between">
        <div class="w-1/2 pr-2">
          <h2 class="text-xl font-semibold mb-2 text-gray-700">Your Hand</h2>
          <div v-for="card in playerHand" :key="card.id" class="bg-white p-2 mb-2 rounded shadow">
            {{ card.rank }} of {{ card.suit }}
          </div>
        </div>
        <div class="w-1/2 pl-2">
          <h2 class="text-xl font-semibold mb-2 text-gray-700">Dealer's Hand</h2>
          <div v-if="gameEnded">
            <div v-for="card in dealerHand" :key="card.id" class="bg-white p-2 mb-2 rounded shadow">
              {{ card.rank }} of {{ card.suit }}
            </div>
          </div>
          <div v-else class="bg-gray-300 p-2 rounded shadow text-center">
            [Hidden]
          </div>
        </div>
      </div>
      <div v-if="!gameEnded" class="flex justify-center space-x-4">
        <button @click="fold" class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
          Fold
        </button>
        <button @click="doubleBet" class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          Double Bet
        </button>
      </div>
      <div v-else class="text-center space-y-4">
        <h2 class="text-2xl font-bold text-gray-800">{{ result }}</h2>
        <p class="text-xl text-gray-700">Your winnings: {{ winnings }}</p>
        <button @click="resetGame" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Play Again
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      betAmount: 0,
      gameStarted: false,
      gameEnded: false,
      playerHand: [],
      dealerHand: [],
      deck: [],
      result: '',
      winnings: 0
    }
  },
  methods: {
    startGame() {
      this.gameStarted = true
      this.initializeDeck()
      this.dealCards()
    },
    initializeDeck() {
      const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs']
      const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
      const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
      this.deck = []
      for (let suit of suits) {
        for (let i = 0; i < ranks.length; i++) {
          this.deck.push({ suit, rank: ranks[i], value: values[i] })
        }
      }
      this.shuffleDeck()
    },
    shuffleDeck() {
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
      }
    },
    dealCards() {
      this.playerHand = [this.deck.pop(), this.deck.pop()]
      this.dealerHand = [this.deck.pop(), this.deck.pop()]
    },
    fold() {
      this.gameEnded = true
      this.result = 'You folded. You lose your bet.'
      this.winnings = -this.betAmount
    },
    doubleBet() {
      this.gameEnded = true
      this.evaluateHands()
    },
    evaluateHands() {
      const playerHand = this.evaluateHand(this.playerHand)
      const dealerHand = this.evaluateHand(this.dealerHand)
        console.log('playerHand', playerHand)
        console.log('dealerHand', dealerHand)

        // Evaluate scenarios involving pairs
        if (playerHand.type === 'pair' && dealerHand.type !== 'pair') {
            this.result = 'You win!'
            this.winnings = this.betAmount * 2
        } else if (dealerHand.type === 'pair' && playerHand.type !== 'pair') {
            this.result = 'Dealer wins. You lose your bet.'
            this.winnings = -this.betAmount * 2
        // If both have pairs, compare the values
        } else if (playerHand.type === 'pair' && dealerHand.type === 'pair') {
            if (playerHand.pairValue > dealerHand.pairValue) {
            this.result = 'You win!'
            this.winnings = this.betAmount * 2
            } else if (playerHand.pairValue < dealerHand.pairValue) {
            this.result = 'Dealer wins. You lose your bet.'
            this.winnings = -this.betAmount * 2
            } else {
            this.result = "It's a tie. Your bet is returned."
            this.winnings = 0
            }
        // No pairs, evaluate high card
        } else {
            if (playerHand.highCard > dealerHand.highCard) {
            this.result = 'You win!'
            this.winnings = this.betAmount * 2
            } else if (playerHand.highCard < dealerHand.highCard) {
            this.result = 'Dealer wins. You lose your bet.'
            this.winnings = -this.betAmount * 2
            // Equal high cards, evaluate low card
            } else if (playerHand.lowCard > dealerHand.lowCard) {
            this.result = 'You win!'
            this.winnings = this.betAmount * 2
            } else if (playerHand.lowCard < dealerHand.lowCard) {
            this.result = 'Dealer wins. You lose your bet.'
            this.winnings = -this.betAmount * 2
            } else {
            this.result = "It's a tie. Your bet is returned."
            this.winnings = 0
            }
        }
    },
    evaluateHand(hand) {
        const values = hand.map(card => card.value).sort((a, b) => b - a)
        const ranks = hand.map(card => card.rank)

        if (ranks[0] === ranks[1]) {
            return {
            type: 'pair',
            pairValue: values[0],
            }
        } else {
            return {
            type: 'highCard',
            highCard: values[0],
            lowCard: values[1],
            }
        }
    },
    resetGame() {
      this.gameStarted = false
      this.gameEnded = false
      this.playerHand = []
      this.dealerHand = []
      this.result = ''
      this.winnings = 0
      this.betAmount = 0
    }
  }
}



/*
import seedrandom from "seedrandom";




onMounted(() => {
   window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
*/
</script>
