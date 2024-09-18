<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-slate-800 flex flex-col">
    <!-- Dealer's hand -->
    <div class="mt-4 px-4">
      <h2 class="text-l font-semibold mb-2 text-white">
        Dealer's Hand {{ dealerHandDisplay ? `(${dealerHandDisplay})` : '' }}
      </h2>
      <div class="flex justify-center space-x-2">
        <div v-if="!hideDealersCards" class="flex space-x-2">
          <div v-for="card in dealerHand" :key="card.id" class="inline-block">
            <img :src="`/cardsFront/${card.suit.toLowerCase()}_${card.rank}.svg`" alt="Card" class="w-18 h-auto">
          </div>
        </div>
        <div v-else class="flex space-x-2">
          <img v-for="i in 3" :key="i" src="/cardBacks/abstract_clouds.svg" alt="Hidden card" class="w-18 h-auto">
        </div>
      </div>
    </div>

    <!-- Separator -->
    <hr class="w-4/5 mx-auto my-6 border-gray-600" />

    <!-- Player's hand -->
    <div class="px-4">
      <h2 class="text-l font-semibold mb-2 text-white">
        Your Hand {{ playerHandDisplay ? `(${playerHandDisplay})` : '' }}
      </h2>
      <div class="flex justify-center space-x-2">
        <div v-if="gameStarted" class="flex space-x-2">
          <div v-for="card in playerHand" :key="card.id" class="inline-block">
            <img :src="`/cardsFront/${card.suit.toLowerCase()}_${card.rank}.svg`" alt="Card" class="w-18 h-auto">
          </div>
        </div>
        <div v-else class="flex space-x-2">
          <img v-for="i in 3" :key="i" src="/cardBacks/abstract_clouds.svg" alt="Hidden card" class="w-18 h-auto">
        </div>
      </div>
    </div>

    <!-- Game info and controls -->
    <div class="flex-grow flex flex-col justify-end p-6">
      <!-- Results overlay -->
      <div v-if="displayResults" class="mb-8">
        <div :class="[
          'mx-auto pt-2 pb-2 rounded-lg w-80 text-center',
          result.includes('You win') ? 'bg-green-500 shadow-sm shadow-green-300' :
          result.includes('Dealer wins') ? 'bg-red-500 shadow-sm shadow-red-300' :
          result.includes('You folded') ? 'bg-red-500 shadow-sm shadow-red-300' : 'bg-gray-500 shadow-sm'
        ]">
          <p class="mb-1 text-lg font-bold text-white">{{ result }}</p>
          <p v-if="result.includes('Dealer wins')" class="mb-1 text-white"> Amount Lost: {{ betAmount }}</p>
          <p v-if="result.includes('You folded')" class="mb-1 text-white"> Amount Lost: {{ betAmount }}</p>
          <p v-if="result.includes('You win')" class="mb-1 text-white"> Amount Won: {{ winnings }}</p>
        </div>
      </div>

      <!-- Wallet and bet container -->
      <div class="flex justify-center mb-8">
        <div class="inline-flex justify-center items-center space-x-6 bg-gray-700 px-6 py-2 rounded-full md:px-12 md:py-4">
          <div class="text-center">
            <p class="text-gray-300 text-sm">Wallet</p>
            <p class="text-white text-md font-bold">{{ wallet }}</p>
          </div>
          <div class="text-center">
            <p class="text-gray-300 text-sm">Bet</p>
            <p class="text-white text-md font-bold">{{ betAmount }}</p>
          </div>
        </div>
      </div>

      <!-- Bet slider -->
      <div v-if="!gameStarted" class="w-full max-w-[66vw] mx-auto mb-8 md:max-w-[30vw]">
        <input
          v-model.number="betAmount"
          type="range"
          :min="1"
          :max="maxBet"
          class="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <!-- Game buttons -->
      <div class="flex justify-center">
        <div v-if="waitingToStart">
          <button @click="resetGame" class="bg-blue-500 text-white px-8 py-4 drop-shadow-lg rounded-lg md:px-12 md:py-6">Play Again</button>
        </div>
        <div v-else>
          <div v-if="!gameStarted">
            <button @click="startGame" class="bg-blue-500 text-white px-8 py-4 rounded-lg drop-shadow-lg md:px-12 md:py-6">Place Bet</button>
          </div>
          <div v-else class="space-x-4">
            <button @click="fold" class="bg-red-500 text-white px-6 py-4 rounded-lg drop-shadow-lg md:px-10 md:py-6">Fold</button>
            <button @click="doubleBet" class="bg-green-500 text-white px-6 py-4 rounded-lg drop-shadow-lg md:px-10 md:py-6">Double Down</button>
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
      defaultBet: 1,
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
    },
    playerHandDisplay() {
      if (!this.gameStarted || this.playerHand.length === 0) return null;
      const handEvaluation = this.evaluateHand(this.playerHand);
      return handEvaluation.type;
    },
    dealerHandDisplay() {
      if (this.hideDealersCards || this.dealerHand.length === 0) return null;
      const handEvaluation = this.evaluateHand(this.dealerHand);
      return handEvaluation.type;
    }
  },
  methods: {
    startGame() {
      this.gameStarted = true
      this.wallet -= this.betAmount
      this.defaultBet = this.betAmount
      this.initializeDeck()
      this.dealCards()
    },
    startNewRound() {
      this.waitingToStart = false
      this.gameStarted = false
    },
    initializeDeck() {
      const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs']
      //const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
      const ranks = ['7', '8', '9', '10', 'jack', 'queen', 'king', 'ace']
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
      this.playerHand = [this.deck.pop(), this.deck.pop(), this.deck.pop()]
      this.dealerHand = [this.deck.pop(), this.deck.pop(), this.deck.pop()]
    },
    fold() {
      //this.gameEnded = true
      this.result = 'You folded. You lose your bet.'
      this.hideDealersCards = false
      this.waitingToStart = true
      this.displayResults = true
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

        if (playerHand.rank > dealerHand.rank) {
            this.result = 'You win!'
            this.winnings = this.betAmount * 2
            this.wallet += this.winnings
        } else if (playerHand.rank < dealerHand.rank) {
            this.result = 'Dealer wins. You lose your bet.'
        } else {
            // If ranks are equal, compare the highest card values
            if (playerHand.highCard > dealerHand.highCard) {
            this.result = 'You win!'
            this.winnings = this.betAmount * 2
            this.wallet += this.winnings
            } else if (playerHand.highCard < dealerHand.highCard) {
            this.result = 'Dealer wins :('
            } else {
            this.result = "Tie. Bet returned."
            this.wallet += this.betAmount
            this.winnings = 0
            }
        }
        this.displayResults = true
    },
    evaluateHand(hand) {
        const values = hand.map(card => card.value).sort((a, b) => b - a)
        const suits = hand.map(card => card.suit)
        const ranks = hand.map(card => card.rank)

        const isFlush = suits.every(suit => suit === suits[0])
        const isStraight = this.checkStraight(values)

        if (isFlush && isStraight) {
            return { rank: 6, type: 'Straight Flush', highCard: Math.max(...values) }
        }

        if (values[0] === values[1] && values[1] === values[2]) {
            return { rank: 5, type: '3 of a Kind', highCard: values[0] }
        }

        if (isStraight) {
            return { rank: 4, type: 'Straight', highCard: Math.max(...values) }
        }

        if (isFlush) {
            return { rank: 3, type: 'Flush', highCard: Math.max(...values) }
        }

        if (values[0] === values[1] || values[1] === values[2]) {
            return { rank: 2, type: 'Pair', highCard: values[0] === values[1] ? values[0] : values[1] }
        }

        return { rank: 1, type: 'High Card', highCard: Math.max(...values) }
    },
    checkStraight(values) {
        const sortedValues = [...values].sort((a, b) => a - b)
        return (sortedValues[2] - sortedValues[0] === 2) ||
               (sortedValues[0] === 2 && sortedValues[1] === 3 && sortedValues[2] === 14) // A-2-3 straight
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
      // this.betAmount = 1
      if (this.defaultBet > this.wallet / 2) {
        this.betAmount = Math.floor(this.wallet / 2)
      } else {
        this.betAmount = this.defaultBet
      }
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

<style scoped>
/* Remove the previous styles */
</style>
