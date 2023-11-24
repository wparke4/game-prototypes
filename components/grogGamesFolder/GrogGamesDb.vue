<template>
    <PlayerDisplay />
    <GameManager />
    <TurnManager />
</template>




<script setup>
import GameManager from "@/components/grogGamesFolder/GameManager.vue";
import PlayerDisplay from "@/components/grogGamesFolder/PlayerDisplay.vue";
import TurnManager from "@/components/grogGamesFolder/TurnManager.vue";

const gameStarted = useState("gameStarted", () => false);
gameStarted.value = false;


//const gameStarted = useState("gameStarted", () => false);

</script>
<style scoped>
</style>
