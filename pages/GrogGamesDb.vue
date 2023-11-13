<template>
    <div>
      <GrogGamesDb />
    </div>
  </template>

  <script setup>

  import { ref } from 'vue';
  import GrogGamesDb from "@/components/grogGamesFolder/GrogGamesDb.vue";

  const loading = ref(false);
  </script>

  <style lang="postcss" scoped></style>

  <script>
  export default {
    components: {
      GrogGamesDb,
    },
  };
    definePageMeta({
        middleware: ['auth'],
    })
  </script>
