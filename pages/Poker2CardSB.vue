<template>
    <Poker2CardSB />
</template>

<script setup>

import { ref } from 'vue';
import Poker2CardSB from '../components/Poker2CardSB.vue';

const loading = ref(false);
</script>

<style lang="postcss" scoped></style>

<script>
export default {
components: {
    Poker2CardSB
},
};
</script>
