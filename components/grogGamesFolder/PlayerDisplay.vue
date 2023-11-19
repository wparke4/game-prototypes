<template>
    <div class="flex">
        <div
            v-if="waitingToStart"
            v-for="player in players"
            class="flex items-center justify-center w-full"
        >
            {{ player }}
        </div>
    </div>
</template>




<script setup>
const supabase = useSupabaseClient();
let user = useSupabaseUser();
const players = useState("players")
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

// Create a function to handle inserts
const handleUpdates = (payload) => {
  console.log('Change received!', payload)
}

// Listen to inserts
supabase
  .channel('grogGameManager')
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'grogGameManager' }, handleUpdates)
  .subscribe()

players.value = ["Player 1", "Player 2", "Player 3", "Player 4"]

</script>
<style scoped>
</style>
