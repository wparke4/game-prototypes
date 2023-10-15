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

<script>
export default {
  components: {
    Wordrift,
  },
};
</script>
