<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-900 to-slate-800 flex flex-col">
      <!-- Main content -->
      <div class="flex-grow flex flex-col justify-center p-6">
        <!-- Cards container -->
        <div v-if="gameStarted" class="flex justify-center mb-8">
          <div class="w-1/2 pr-2">
            <h2 class="text-xl font-semibold mb-2 text-white">Your Hand</h2>
            <div v-for="card in playerHand" :key="card.id" class="bg-white p-2 mb-2 rounded shadow">
              {{ card.rank }} of {{ card.suit }}
            </div>
          </div>
          <div class="w-1/2 pl-2">
            <h2 class="text-xl font-semibold mb-2 text-white">Dealer's Hand</h2>
            <div v-if="!hideDealersCards">
              <div v-for="card in dealerHand" :key="card.id" class="bg-white p-2 mb-2 rounded shadow">
                {{ card.rank }} of {{ card.suit }}
              </div>
            </div>
            <div v-else class="bg-gray-300 p-2 rounded shadow text-center">
              [Hidden]
            </div>
          </div>
        </div>
        <div v-if="displayResults" class=" bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 class="text-xl font-bold mb-4">Game Over</h2>
                <p class="mb-4">these are results}</p>
            </div>
        </div>
      </div>

      <!-- Bottom section -->
      <div class="p-14">
        <!-- Wallet and bet container -->
        <div class="flex justify-center space-x-6 mb-10">
          <div class="mr-8">
            <p class="text-white">Wallet</p>
            <p class="text-white">{{ wallet }}</p>
          </div>
          <div v-if="!waitingToStart" class="text-white">
            <p>Bet</p>
            <p>{{ betAmount }}</p>
          </div>
          <div v-if="!gameStarted" class="flex items-center">
                <input
                    v-model.number="betAmount"
                    type="range"
                    :min="1"
                    :max="maxBet"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>

        <!-- Game buttons -->
        <div class="flex justify-center">
            <div v-if="waitingToStart">
                <button @click="resetGame" class="bg-blue-500 text-white px-8 py-4 drop-shadow-lg rounded-lg">Play Again</button>
            </div>
            <div v-else>
                <div v-if="!gameStarted">
                    <button @click="startGame" class="bg-blue-500 text-white px-8 py-4 rounded-lg drop-shadow-lg">Place Bet</button>
                </div>
                <div v-else class="space-x-4">
                    <button @click="fold" class="bg-red-500 text-white px-6 py-4 rounded-lg drop-shadow-lg">Fold</button>
                    <button @click="doubleBet" class="bg-green-500 text-white px-6 py-4 rounded-lg drop-shadow-lg">Double Down</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  </template>

<script>
export default {
  data() {
    return {
      betAmount: 1,
      gameStarted: false,
      //gameEnded: false,
      hideDealersCards: true,
      waitingToStart: false,
      displayResults: false,
      playerHand: [],
      dealerHand: [],
      deck: [],
      result: '',
      winnings: 0,
      wallet: 1000
    }
  },
  computed: {
    maxBet() {
      return Math.floor(this.wallet / 2)
    }
  },
  methods: {
    startGame() {
      this.gameStarted = true
      this.wallet -= this.betAmount
      this.initializeDeck()
      this.dealCards()
    },
    startNewRound() {
      this.waitingToStart = false
      this.gameStarted = false
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
      //this.gameEnded = true
      this.result = 'You folded. You lose your bet.'
      this.hideDealersCards = false
      this.waitingToStart = true
      // this.winnings = -this.betAmount
    },
    doubleBet() {
      this.hideDealersCards = false
      this.waitingToStart = true
      //this.gameEnded = true
      this.wallet -= this.betAmount
      this.betAmount *= 2
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
            this.wallet += this.winnings
        } else if (dealerHand.type === 'pair' && playerHand.type !== 'pair') {
            this.result = 'Dealer wins. You lose your bet.'
        // If both have pairs, compare the values
        } else if (playerHand.type === 'pair' && dealerHand.type === 'pair') {
            if (playerHand.pairValue > dealerHand.pairValue) {
            this.result = 'You win!'
            this.winnings = this.betAmount * 2
            this.wallet += this.winnings
            } else if (playerHand.pairValue < dealerHand.pairValue) {
            this.result = 'Dealer wins. You lose your bet.'
            } else {
            this.result = "It's a tie. Your bet is returned."
            this.wallet += this.betAmount
            this.winnings = 0
            }
        // No pairs, evaluate high card
        } else {
            if (playerHand.highCard > dealerHand.highCard) {
            this.result = 'You win!'
            this.winnings = this.betAmount * 2
            this.wallet += this.winnings
            } else if (playerHand.highCard < dealerHand.highCard) {
            this.result = 'Dealer wins. You lose your bet.'
            // Equal high cards, evaluate low card
            } else if (playerHand.lowCard > dealerHand.lowCard) {
            this.result = 'You win!'
            this.winnings = this.betAmount * 2
            this.wallet += this.winnings
            } else if (playerHand.lowCard < dealerHand.lowCard) {
            this.result = 'Dealer wins. You lose your bet.'
            } else {
            this.result = "It's a tie. Your bet is returned."
            this.wallet += this.betAmount
            this.winnings = 0
            }
        }
        this.displayResults = true
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
      this.waitingToStart = false
      this.gameStarted = false
      this.hideDealersCards = true
      this.displayResults = false
      //this.gameEnded = false
      this.playerHand = []
      this.dealerHand = []
      this.result = ''
      this.winnings = 0
      this.betAmount = 1
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
