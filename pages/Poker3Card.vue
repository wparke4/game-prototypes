<template>
    <Poker3Card />
</template>

<script setup>

import { ref } from 'vue';
import Poker3Card from '../components/Poker3Card.vue';

const loading = ref(false);
</script>

<style lang="postcss" scoped></style>

<script>
export default {
components: {
    Poker3Card
},
};
</script>
