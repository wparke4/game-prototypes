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
players.value = []
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

// Create a function to handle inserts
const handleUpdates = (payload) => {
    console.log('Change received!', payload)

    if (payload.new.gameStarted) {
        gameStarted.value = true
    }
    if (payload.new.players) {
        playerIds.value = payload.new.players
        fetchUsernames()
    }
}

const fetchUsernames = async () => {
    console.log("fetchUsernames called")
    console.log("playerIds length ", playerIds.value.length)
    console.log("playerIds ", playerIds.value)
    console.log("playerIds ", playerIds.value[0])
    players.value = []
    for (let i = 0; i < playerIds.value.length; i++) {
        const currentId = playerIds.value[i]
        const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', currentId)

        if (error) {
            console.error('Error fetching usernames:', error);
            return;
        }

        console.log("player data.username ", data[0].username)
        players.value.push(data[0].username)
        console.log("players array: ", players.value)
    }
}

// Listen to inserts
supabase
    .channel('grogGameManager')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'grogGameManager' }, handleUpdates)
    .subscribe()

</script>
<style scoped>
</style>
