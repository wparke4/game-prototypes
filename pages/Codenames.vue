<template>
  <div>
    <Codenames />
  </div>
</template>

<script setup>

import { ref } from 'vue';
import Codenames from "@/components/Codenames.vue";

const loading = ref(false);
</script>

<style lang="postcss" scoped></style>

<script>
export default {
  components: {
    Codenames,
  },
};
definePageMeta({
  middleware: ['auth'],
})
</script>
