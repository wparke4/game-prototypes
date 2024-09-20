<template>
    <Poker3CardSwap />
</template>

<script setup>

import { ref } from 'vue';
import Poker3CardSwap from '../components/Poker3CardSwap.vue';

const loading = ref(false);
</script>

<style lang="postcss" scoped></style>

<script>
export default {
components: {
    Poker3CardSwap
},
};
</script>
