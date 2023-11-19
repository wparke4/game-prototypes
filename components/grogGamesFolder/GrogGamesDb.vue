<template>
    <PlayerDisplay />
    <GameManager />
    <Prompts />
</template>




<script setup>
import Prompts from "@/components/grogGamesFolder/Prompts.vue";
import GameManager from "@/components/grogGamesFolder/GameManager.vue";
import PlayerDisplay from "@/components/grogGamesFolder/PlayerDisplay.vue";

const gameStarted = useState("gameStarted", () => false);
gameStarted.value = false;


//const gameStarted = useState("gameStarted", () => false);

</script>
<style scoped>
</style>
