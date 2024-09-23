<template>
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
  </template>

  <script setup>
  import { defineProps } from 'vue'

  const props = defineProps({
    wallet: {
      type: Number,
      required: true
    },
    betAmount: {
      type: Number,
      required: true
    }
  })
  </script>
