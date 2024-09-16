<template>
    <div class="min-h-screen bg-orange-100 py-6 flex flex-col items-center justify-center sm:py-12">
        <Poker2Card />
    </div>
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
