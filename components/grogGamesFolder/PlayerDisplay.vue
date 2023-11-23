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
const turnIndex = useState("turnIndex")
const promptIndex = useState("promptIndex")

// Create a function to handle inserts
const handleUpdates = (payload) => {
    console.log('Change received!', payload)

    if (payload.new.turnIndex > -1) {
        handleCurrentPlayerChange(payload)
    }

    if (payload.new.gameStarted) {
        gameStarted.value = true
    }

    if (payload.new.players) {
        playerIds.value = payload.new.players
        checkForPlayerChange()
    }

    if (payload.new.turnIndex > -1) {
        turnIndex.value = payload.new.turnIndex
    }

    if (payload.new.promptIndex > -1) {
        promptIndex.value = payload.new.promptIndex
    }
}

const handleCurrentPlayerChange = (payload) => {
    console.log("turnIndex: ", payload.new.turnIndex)
    for(let i = 0; i < players.value.length; i++) {
        players.value[i].isCurrentPlayer = false
    }
    const currentPlayer = players.value[payload.new.turnIndex]
    currentPlayer.isCurrentPlayer = true
    console.log("currentPlaye Id: ", currentPlayer.id)
    console.log("your id: ", user.value.id)
    //players.value[payload.new.turnIndex].isCurrentPlayer = true


    //check if it is the local player's turn
    if (players.value[payload.new.turnIndex].id === user.value.id) {
        yourTurn.value = true
        console.log("it is your turn", yourTurn.value)
        opponentTurn.value = false
    } else {
        yourTurn.value = false
        opponentTurn.value = true
    }
    console.log(players.value[payload.new.turnIndex].username + " is the current player")
    console.log(players.value[payload.new.turnIndex].isCurrentPlayer)
}

const checkForPlayerChange = () => {
    if (playerIds.value.length > players.value.length) {
        console.log("player added")
        //fetch username of new player
        //add to players array
        fetchUsernames()
    }
    else if (playerIds.value.length < players.value.length) {
        console.log("player removed")
        //determine which player was removed
        //remove from players array
        fetchUsernames()
    } else {
        console.log("no change to players array")
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
