<template>
  <div>
    <Wordrift />
  </div>
</template>

<script setup>

import { ref } from 'vue';
import Wordrift from "@/components/wordriftFolder/Wordrift.vue";

const loading = ref(false);
</script>

<style lang="postcss" scoped></style>

<script>
export default {
  components: {
    Wordrift,
  },
};
</script>
