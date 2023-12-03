<template>
    <Header />
  <div
      class="flex flex-col w-4/5 items-center justify-center h-screen space-y-6"
  >
      <div
          class="w-2/3 h-28 border-gray-500 border-2 rounded-md justify-center items-center flex"
      >
          <nuxt-link to="/wordrift">Wordrift</nuxt-link>
      </div>
      <div
          class="w-2/3 h-28 border-gray-500 border-2 rounded-md justify-center items-center flex"
      >
          <nuxt-link to="/grogGamesDb">Grog Games</nuxt-link>
      </div>
      <div
          class="w-2/3 h-28 border-gray-500 border-2 rounded-md justify-center items-center flex"
      >
          <nuxt-link to="/blindMaze">Blind Maze</nuxt-link>
      </div>
  </div>
</template>
<script setup>
import Header from '@/components/Header.vue'
</script>
