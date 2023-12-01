<template>
    <div class="flex flex-col h-screen">
        <Header />
        <BlindMaze/>
    </div>
</template>

<script setup>

import { ref } from 'vue';
import BlindMaze from '@/components/BlindMaze.vue';
import Header from "@/components/Header.vue";

const loading = ref(false);
</script>

<style lang="postcss" scoped></style>

<script>
export default {
components: {
    BlindMaze,
    Header
},
};
</script>
