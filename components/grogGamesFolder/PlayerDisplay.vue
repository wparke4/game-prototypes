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

    if (payload.new.turnIndex) {
        players.value.array.forEach(player => {
            player.value.isCurrentPlayer = false
        })
        players.value[payload.new.turnIndex].isCurrentPlayer = true
        console.log(players.value[payload.new.turnIndex].username + " is the current player")
        console.log(players.value[payload.new.turnIndex].isCurrentPlayer)
    }
}

const fetchUsernames = async () => {
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
        players.value.push( { username: data[0].username, id: playerIds.value[i], isCurrentPlayer: false } )
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
.currentPlayer {
    background-color: rgb(98, 241, 98);
}
</style>
