<template>
  <div>
    <GrogGames />
  </div>
</template>

<script setup>

import { ref } from 'vue';
import GrogGames from "@/components/grogGamesFolder/GrogGames.vue";

const loading = ref(false);
</script>

<style lang="postcss" scoped></style>

<script>
export default {
  components: {
    GrogGames,
  },
};
</script>
