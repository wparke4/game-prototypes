<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-900 to-slate-800 flex flex-col">
      <!-- Dealer's hand -->
      <div class="mt-4 px-4">
        <h2 class="text-l font-semibold mb-2 text-white">
          Dealer's Hand {{ dealerHandDisplay ? `(${dealerHandDisplay})` : '' }}
        </h2>
        <div class="flex justify-center space-x-2">
          <div v-if="!hideDealersCards" class="flex space-x-2">
            <div v-for="(card, index) in sortedDealerHand" :key="card.id" class="inline-block">
              <img :src="`/cardsFront/${card.suit.toLowerCase()}_${card.rank}.svg`" alt="Card" class="w-18 h-auto" :class="{ 'glow': isDealerBestCard(index) }">
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
            <div v-for="(card, index) in sortedPlayerHand" :key="card.id" class="inline-block">
              <img
                :src="`/cardsFront/${card.suit.toLowerCase()}_${card.rank}.svg`"
                alt="Card"
                class="w-18 h-auto cursor-pointer"
                :class="{ 'glow': isPlayerBestCard(index), 'selected': selectedCardIndex === index }"
                @click="selectCard(index)"
              >
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
              <button @click="check" class="bg-red-500 text-white px-6 py-4 rounded-lg drop-shadow-lg md:px-10 md:py-6">Check</button>
              <button
                @click="swapCard"
                class="bg-green-500 text-white px-6 py-4 rounded-lg drop-shadow-lg md:px-10 md:py-6"
                :disabled="selectedCardIndex === null"
                :class="{ 'opacity-50 cursor-not-allowed': selectedCardIndex === null }"
              >
                Swap Card
              </button>
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
        wallet: 1000,
        sortedPlayerHand: [],
        sortedDealerHand: [],
        playerHandEvaluation: null,
        dealerHandEvaluation: null,
        selectedCardIndex: null,
      }
    },
    computed: {
      maxBet() {
        return Math.floor(this.wallet)
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
        // Add this line to sort and reveal player's hand immediately
        this.playerHandEvaluation = this.evaluateHand(this.playerHand)
        this.sortedPlayerHand = this.sortHand(this.playerHand, this.playerHandEvaluation)
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
      check() {
        console.log('check')
        this.evaluateHands()
        this.hideDealersCards = false
        this.displayResults = true
        this.waitingToStart = true
      },
      selectCard(index) {
        if (this.gameStarted && !this.waitingToStart) {
          this.selectedCardIndex = this.selectedCardIndex === index ? null : index;
        }
      },
      swapCard() {
        if (this.selectedCardIndex !== null) {
          console.log('swapCard')
          const newCard = this.deck.pop()

          // Store the index in the original (unsorted) playerHand
          const originalIndex = this.playerHand.findIndex(card => card === this.sortedPlayerHand[this.selectedCardIndex])

          // Replace the card in the original playerHand
          this.playerHand[originalIndex] = newCard

          // Give the dealer an extra card
          const dealerExtraCard = this.deck.pop()
          this.dealerHand.push(dealerExtraCard)

          // Re-evaluate and sort the player's hand
          this.playerHandEvaluation = this.evaluateHand(this.playerHand)
          this.sortedPlayerHand = this.sortHand(this.playerHand, this.playerHandEvaluation)

          this.selectedCardIndex = null // Reset selection after swap

          // Evaluate dealer's hand and display results
          this.evaluateHands()
          this.hideDealersCards = false
          this.displayResults = true
          this.waitingToStart = true
        }
      },
      fold() {
        //this.gameEnded = true
        this.result = 'You folded. You lose your bet.'
        this.hideDealersCards = false
        this.waitingToStart = true
        this.displayResults = true
        // this.winnings = -this.betAmount
        this.dealerHandEvaluation = this.evaluateHand(this.dealerHand)
        this.sortedDealerHand = this.sortHand(this.dealerHand, this.dealerHandEvaluation)
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
        this.playerHandEvaluation = this.evaluateHand(this.playerHand)
        this.dealerHandEvaluation = this.evaluateHand(this.dealerHand)
          console.log('playerHand', this.playerHandEvaluation)
          console.log('dealerHand', this.dealerHandEvaluation)

          this.sortedPlayerHand = this.sortHand(this.playerHand, this.playerHandEvaluation)
          this.sortedDealerHand = this.sortHand(this.dealerHand, this.dealerHandEvaluation)

          if (this.playerHandEvaluation.rank > this.dealerHandEvaluation.rank) {
              this.result = 'You win!'
              this.winnings = this.betAmount * 2
              this.wallet += this.winnings
          } else if (this.playerHandEvaluation.rank < this.dealerHandEvaluation.rank) {
              this.result = 'Dealer wins. You lose your bet.'
          } else {
              // If ranks are equal, compare the highest card values
              if (this.playerHandEvaluation.highCard > this.dealerHandEvaluation.highCard) {
              this.result = 'You win!'
              this.winnings = this.betAmount * 2
              this.wallet += this.winnings
              } else if (this.playerHandEvaluation.highCard < this.dealerHandEvaluation.highCard) {
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
        // If it's a 4-card hand (dealer's hand after swap), find the best 3-card combination
        if (hand.length === 4) {
          const combinations = [
            [0, 1, 2],
            [0, 1, 3],
            [0, 2, 3],
            [1, 2, 3]
          ];

          let bestHand = null;
          let bestEvaluation = { rank: 0, type: '', highCard: 0 };

          for (const combo of combinations) {
            const threeCardHand = combo.map(i => hand[i]);
            const evaluation = this.evaluateThreeCardHand(threeCardHand);

            if (evaluation.rank > bestEvaluation.rank ||
                (evaluation.rank === bestEvaluation.rank && evaluation.highCard > bestEvaluation.highCard)) {
              bestHand = threeCardHand;
              bestEvaluation = evaluation;
            }
          }

          return bestEvaluation;
        }

        // For 3-card hands, evaluate directly
        return this.evaluateThreeCardHand(hand);
      },

      evaluateThreeCardHand(hand) {
        const values = hand.map(card => card.value).sort((a, b) => b - a);
        const suits = hand.map(card => card.suit);
        const ranks = hand.map(card => card.rank);

        const isFlush = suits.every(suit => suit === suits[0]);
        const isStraight = this.checkStraight(values);

        if (isFlush && isStraight) {
          return { rank: 6, type: 'Straight Flush', highCard: Math.max(...values) };
        }

        if (values[0] === values[1] && values[1] === values[2]) {
          return { rank: 5, type: '3 of a Kind', highCard: values[0] };
        }

        if (isStraight) {
          return { rank: 4, type: 'Straight', highCard: Math.max(...values) };
        }

        if (isFlush) {
          return { rank: 3, type: 'Flush', highCard: Math.max(...values) };
        }

        if (values[0] === values[1] || values[1] === values[2]) {
          return { rank: 2, type: 'Pair', highCard: values[0] === values[1] ? values[0] : values[1] };
        }

        return { rank: 1, type: 'High Card', highCard: Math.max(...values) };
      },
      checkStraight(values) {
          const sortedValues = [...values].sort((a, b) => a - b)
          return (sortedValues[2] - sortedValues[1] === 1) && (sortedValues[1] - sortedValues[0] === 1)

          /*
          return (sortedValues[2] - sortedValues[0] === 2) ||
                 (sortedValues[0] === 2 && sortedValues[1] === 3 && sortedValues[2] === 14) // A-2-3 straight
        */
      },
      sortHand(hand, evaluation) {
        const sortedHand = [...hand]
        if (evaluation.type === 'Pair') {
          sortedHand.sort((a, b) => {
            if (a.value === b.value && a.value === evaluation.highCard) return 0
            if (a.value === evaluation.highCard) return -1
            if (b.value === evaluation.highCard) return 1
            return b.value - a.value
          })
        } else if (evaluation.type === 'Straight' || evaluation.type === 'Straight Flush') {
          sortedHand.sort((a, b) => b.value - a.value)
          // Handle A-2-3 straight
          if (sortedHand[0].value === 14 && sortedHand[1].value === 3 && sortedHand[2].value === 2) {
            [sortedHand[0], sortedHand[1], sortedHand[2]] = [sortedHand[1], sortedHand[2], sortedHand[0]]
          }
        } else {
          sortedHand.sort((a, b) => b.value - a.value)
        }
        return sortedHand
      },
      isPlayerBestCard(index) {
        if (!this.playerHandEvaluation) return false;
        switch (this.playerHandEvaluation.type) {
          case 'Pair':
            return index === 0 || index === 1;
          case 'Three of a Kind':
          case 'Straight':
          case 'Flush':
          case 'Straight Flush':
            return true; // All cards glow for these hand types
          default:
            return index === 0; // Only the highest card glows for High Card
        }
      },
      isDealerBestCard(index) {
        if (!this.dealerHandEvaluation) return false;
        switch (this.dealerHandEvaluation.type) {
          case 'Pair':
            return index === 0 || index === 1;
          case 'Three of a Kind':
          case 'Straight':
          case 'Flush':
          case 'Straight Flush':
            return true; // All cards glow for these hand types
          default:
            return index === 0; // Only the highest card glows for High Card
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
        this.sortedPlayerHand = []
        this.sortedDealerHand = []
        this.playerHandEvaluation = null
        this.dealerHandEvaluation = null
        // this.betAmount = 1
        if (this.defaultBet > this.wallet / 2) {
          this.betAmount = Math.floor(this.wallet / 2)
        } else {
          this.betAmount = this.defaultBet
        }
        this.selectedCardIndex = null
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
  .glow {
    box-shadow: 0 0 10px 3px rgba(255, 215, 0, 0.7); /* Golden glow */
    /* border-radius: 0px; /* Adjust based on your card's corner radius */
  }

  .selected {
    transform: translateY(-10px);
    transition: transform 0.3s ease;
  }
  </style>
