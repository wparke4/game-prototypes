<template>
    <Prompts />
</template>




<script setup>
import Prompts from "@/components/grogGamesFolder/Prompts.vue";

const gameStarted = useState("gameStarted", () => false);
gameStarted.value = false;


//const gameStarted = useState("gameStarted", () => false);

</script>
<style scoped>
</style>
