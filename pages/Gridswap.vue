<template>
    <div class="flex flex-col h-screen">
        <Header/>
        <Gridswap/>
    </div>
</template>

<script setup>

import { ref } from 'vue';
import Gridswap from '../components/Gridswap.vue';
import Header from "@/components/Header.vue";

const loading = ref(false);
</script>

<style lang="postcss" scoped></style>

<script>
export default {
components: {
    Gridswap,
    Header
},
};
</script>
