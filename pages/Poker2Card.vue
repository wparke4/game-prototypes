<template>
    <Poker2Card />
</template>

<script setup>

import { ref } from 'vue';
import Poker2Card from '../components/Poker2Card.vue';

const loading = ref(false);
</script>

<style lang="postcss" scoped></style>

<script>
export default {
components: {
    Poker2Card
},
};
</script>
