<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-900 to-slate-800 flex flex-col">
      <!-- Main content -->
      <div class="flex-grow flex flex-col justify-center p-6 relative">
        <!-- Cards container -->
        <div v-if="gameStarted" class="flex justify-center mb-8 md:absolute md:top-24 md:left-1/2 md:transform md:-translate-x-1/2 md:w-1/2 md:h-96">
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
        <!-- Results overlay -->
        <div v-if="displayResults" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-1/4 flex items-center justify-center md:w-2/3">
            <div :class="[
                'p-6 rounded-lg w-80 text-center',
                result.includes('You win') ? 'bg-green-500 shadow-sm shadow-green-300' :
                result.includes('Dealer wins') ? 'bg-red-500 shadow-sm shadow-red-300' :
                result.includes('You folded') ? 'bg-red-500 shadow-sm shadow-red-300' : 'bg-gray-300 shadow-sm'
            ]">
                <p class="mb-4 text-xl font-bold text-white">{{ result }}</p>
                <p v-if="result.includes('Dealer wins')" class="mb-2 text-white"> Amount Lost: {{ betAmount }}</p>
                <p v-if="result.includes('You folded')" class="mb-2 text-white"> Amount Lost: {{ betAmount }}</p>
                <p v-if="result.includes('You win')" class="mb-2 text-white"> Amount Won: {{ winnings }}</p>

            </div>
        </div>
      </div>

      <!-- Bottom section -->
      <div class="py-14 px-4 relative">
        <!-- Wallet and bet container -->
        <div class="flex justify-center mb-16">
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
        <div v-if="!gameStarted" class="absolute left-1/2 transform -translate-x-1/2 w-full max-w-[66vw] px-4 -mt-12 md:max-w-[30vw]">
          <input
            v-model.number="betAmount"
            type="range"
            :min="1"
            :max="maxBet"
            class="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <!-- Game buttons -->
        <div class="flex justify-center mt-8">
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

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const { $supabase } = useNuxtApp()
const wallet = ref(0)

const fetchWalletBalance = async () => {
  try {
    const user = await $supabase.auth.getUser()
    if (!user.data.user) throw new Error('No user logged in')

    const { data, error } = await $supabase
      .from('twoPoker')
      .select('wallet')
      .eq('user_id', user.data.user.id)
      .single()

    if (error) throw error
    wallet.value = data.wallet
  } catch (error) {
    console.error('Error fetching wallet balance:', error)
    // Handle error (e.g., show a notification to the user)
  }
}

const updateWalletBalance = async (newBalance) => {
  try {
    const user = await $supabase.auth.getUser()
    if (!user.data.user) throw new Error('No user logged in')

    const { error } = await $supabase
      .from('twoPoker')
      .update({ wallet: newBalance })
      .eq('user_id', user.data.user.id)

    if (error) throw error
  } catch (error) {
    console.error('Error updating wallet balance:', error)
    // Handle error (e.g., show a notification to the user)
  }
}

onMounted(() => {
  fetchWalletBalance()
})

// Rest of your component logic
const defaultBet = ref(1)
const betAmount = ref(1)
const gameStarted = ref(false)
const hideDealersCards = ref(true)
const waitingToStart = ref(false)
const displayResults = ref(false)
const playerHand = ref([])
const dealerHand = ref([])
const deck = ref([])
const result = ref('')
const winnings = ref(0)

// ... rest of your component methods ...

// Example of updating a method:
const startGame = () => {
  gameStarted.value = true
  wallet.value -= betAmount.value
  updateWalletBalance(wallet.value) // Update Supabase
  defaultBet.value = betAmount.value
  initializeDeck()
  dealCards()
}

// ... update other methods similarly ...

</script>

<style scoped>
/* Remove the previous styles */
</style>
