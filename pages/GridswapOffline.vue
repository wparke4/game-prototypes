<template>
    <div class="flex flex-col h-screen">
        <GridswapOffline />
    </div>
</template>

<script setup>

import { ref } from 'vue';
import GridswapOffline from '../components/GridswapOffline.vue';

const loading = ref(false);
</script>

<style lang="postcss" scoped></style>

<script>
export default {
components: {
    GridswapOffline
},
};
</script>
