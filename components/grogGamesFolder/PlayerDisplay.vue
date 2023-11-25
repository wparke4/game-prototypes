<template>
    <div class="flex items-center justify-center w-full">
        <div
            v-if="waitingToStart"
            v-for="player in players"
            class="w-24 border-gray-400 border-2 rounded-lg p-2 m-2 text-center"
            id="player.id"
            :class="{ currentPlayer: player.isCurrentPlayer }"
        >
            {{ player.username }}
        </div>
    </div>
</template>




<script setup>
const supabase = useSupabaseClient();
let user = useSupabaseUser();
const players = useState("players")
const playerIds = useState("playerIds")
const gameStarted = useState("gameStarted");
const currentPlayer = useState("currentPlayer")
const yourTurn = useState("yourTurn")
const opponentTurn = useState("opponentTurn")
const waitingToStart = useState("waitingToStart");
const gameCode = ref("");
const tempGameId = ref(null);
const gameId = useState("gameId");
const isGameHost = useState("isGameHost")
const gameHost = useState("gameHost")
const turnIndex = useState("turnIndex")
const promptIndex = useState("promptIndex")

</script>
<style scoped>
.currentPlayer {
    background-color: rgb(98, 241, 98);
}
</style>
