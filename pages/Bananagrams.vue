<template>
  <div>
    <Bananagrams />
  </div>
</template>

<script setup>

import { ref } from 'vue';
import Bananagrams from "@/components/Bananagrams.vue";

const loading = ref(false);
</script>

<style lang="postcss" scoped></style>

<script>
export default {
  components: {
    Bananagrams,
  },
};
</script>
