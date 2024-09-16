<template>
    <div class="min-h-screen bg-gray-100 py-6 flex flex-col items-center justify-center sm:py-12">
      <div class="w-full max-w-md px-4 sm:px-0">
        <Header class="mb-6 text-3xl font-bold text-center text-gray-800" />
        <div class="bg-white shadow-lg rounded-3xl p-6 sm:p-10">
          <div class="space-y-4">
            <NuxtLink v-for="(link, index) in links" :key="index"
                      :to="link.to"
                      class="block w-full px-4 py-3 text-sm font-medium text-center text-white bg-gray-800 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
              {{ link.name }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
</template>
<script setup>
import Header from '@/components/Header.vue'

const links = [
    { to: '/wordrift', name: 'Wordrift'},
    { to: '/grogGamesDb', name: 'Grog Games'},
    { to: '/blindMaze', name: 'Blind Maze'},
    { to: '/gridswap', name: 'Grid Swap'},
    { to: '/gridswapOffline', name: 'Grid Swap Offline'},
    { to: '/poker2card', name: 'Poker 2 Card'},
]
</script>
