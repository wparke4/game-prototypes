<template>
    <div>
        <!-- dice and points -->
        <DicePoints title="Dealer's score" :points="dealerPoints" />
        <DicePoints title="Your score" :points="playersPoints" />
    </div>
    <div>
        <!-- results -->
        <p>{{ resultsText }}</p>
    </div>
    <div class="flex-grow flex flex-col justify-end p-6">
        <!-- bet slider, wallet, start/roll/end buttons -->
        <div v-if="!gameInProgress && wallet > 0">
            <InputSlider v-model="betAmount" :max="wallet" />
        </div>
        <div>
            <Wallet :wallet="wallet" :betAmount="betAmount" />
        </div>
        <div>
            <div v-if="!gameInProgress">
                <button @click="startGame">Start Round</button>
            </div>
            <div v-if="gameInProgress">
                <button @click="rollDice">Roll Dice</button>
                <button @click="endturn">End Turn</button>
            </div>
        </div>
    </div>
  </template>

  <script setup>
  import { ref, computed } from 'vue'
  import InputSlider from './InputSlider.vue'
  import Wallet from './Wallet.vue'
  import DicePoints from './DicePoints.vue'

  const gameInProgress = ref(false)
  const dealerPoints = ref(0)
  const dealerSkulls = ref(0)
  const playersPoints = ref(0)
  const playersSkulls = ref(0)
  const wallet = ref(100)
  const resultsText = ref('')
  const betAmount = ref(1)

  const startGame = () => {
    gameInProgress.value = true
    wallet.value -= betAmount.value
  }
  const rollDice = () => {
    console.log('Rolling dice')
  }
  const endturn = () => {
    console.log('Ending turn')
    evaluateGame()
  }
  const evaluateGame = () => {
    handleResults(1)
  }
  const handleResults = (result) => {
    if (result === 0) {
      wallet.value += betAmount.value * 2
    }
    updateResultsText(result)
  }
  const updateResultsText = (result) => {
    if (result === 0) {
      resultsText.value = 'You win!'
    } else if (result === 1) {
      resultsText.value = 'You lose!'
    }
    resetGame()
  }
  const resetGame = () => {
    updateBetAmount()
    gameInProgress.value = false
    // Don't reset userBetAmount here to keep it for the next round
  }
  // Ensure betAmount is not greater than wallet
  const updateBetAmount = () => {
    if (betAmount.value > wallet.value) {
        betAmount.value = wallet.value
    }
  }
  /*
  const updateBetAmount = (newBetAmount) => {
    betAmount.value = newBetAmount
  }
  */
  </script>
