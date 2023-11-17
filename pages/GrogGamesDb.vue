<template>
    <div>
        <Header />
        <GrogGamesDb />
    </div>
</template>

<script setup>

import { ref } from 'vue';
import GrogGamesDb from "@/components/grogGamesFolder/GrogGamesDb.vue";
import Header from "@/components/Header.vue";

const loading = ref(false);
</script>

<style lang="postcss" scoped></style>

<script>
export default {
components: {
    GrogGamesDb,
    Header
},
};
definePageMeta({
    middleware: ['auth'],
})
</script>
