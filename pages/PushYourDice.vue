<template>
    <PushYourDice />
</template>

<script setup>

import { ref } from 'vue';
import PushYourDice from '../components/PushYourDice.vue';

const loading = ref(false);
</script>

<style lang="postcss" scoped></style>

<script>
export default {
components: {
    PushYourDice
},
};
</script>
