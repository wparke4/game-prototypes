<template>
    <div>
        <div v-if="game">
            Game ID: {{ game.id }}
        </div>
        <div
            v-if="gameStatus === 'inProgress'"
        >
            Game in progress
        </div>
        <div
            v-else-if="gameStatus === 'completed'"
        >

        </div>
        <div
            v-else-if="gameStatus === 'notStarted'"
            class="flex flex-col w-full items-center justify-center h-screen"
        >
            <button
                v-if="isGameHost"
                @click="startGame()"
                type="submit"
                class="btn btn-lg btn-primary w-full"
            >
                Start Game
            </button>
            <div v-else >
                Waiting for host to start game
            </div>

        </div>
        <div
            v-else
            class="flex flex-col w-full items-center justify-center gap-9 h-screen"
        >
            <button
                @click="createGame()"
                type="submit"
                class="btn btn-lg btn-primary w-full"
            >
                Create Game
            </button>
            <div
                class="flex flex-col w-full items-center justify-center text-2xl gap-3"
            >
                Join Game
                <p v-if="gameNotFound" class="text-sm pb-2 text-gray-600">
                    Game with code {{ joinGameId }} does not exist. Please try again.
                </p>
                <input
                    class="input input-md w-1/2 text-left text-black border-warmgray-400"
                    placeholder="Enter Code"
                    v-model="joinGameId"
                    @keyup.enter="joinGame()"
                    @input="emailSent = false"
                >
                <button
                    @click="joinGame()"
                    type="submit"
                    class="btn btn-primary w-1/2"
                >
                    Submit
                </button>
            </div>
        </div>
    </div>
</template>




<script setup>
const { gameStatus } = utils();

const supabase = useSupabaseClient();
let user = useSupabaseUser();

const gameStarted = useState("gameStarted");
const waitingToStart = useState("waitingToStart");
const joinGameId = ref(null);
const game = useState("game");
const gameNotFound = ref(false)
const tempPrompts = useState("tempPrompts", () => []);
const players = useState("players", () => []);

const startGame = async () => {
    //call update turn
    //change "gameStarted" value in table for this game to true and broadcast to all.
    const { error: updateError } = await supabase
        .from('grogGameManager')
        .update({ gameStatus: "inProgress", turnIndex: 0 })
        .eq('id', game.value.id)

    if (updateError) {
        console.log(updateError.message)
        return
    }
};

// computed value for isGameHost
const isGameHost = computed(() => {
    return game.value.host === user.value.id
})

const createGame = async () => {
    const { data, error } = await supabase
        .from('grogGameManager')
        .insert([{ host: user.value.id, players: [user.value.id] }])
        .select();

    if (error) {
        console.log('Error creating game row', error.message)
    } else {
        game.value = data[0];
        waitingToStart.value = true
        setUpPrompts();
    }
}

const joinGame = async () => {
    //check if game exists
    const gameExists = await findGame()
    //if game exists, add this user to the player list for this game
    if (gameExists) {
        await fetchGameData()
        await addUserToGame()
        //fetchExistingPrompts()
        waitingToStart.value = true
    } else {
        return gameNotFound.value = true;
    }
}

const fetchGameData = async () => {
    //we are setting the data retuned equal to grogGameManager
    let { data, error } = await supabase
        .from('grogGameManager')
        .select('*')
        .eq('id', joinGameId.value)
        .single()

        if(error) {
            console.log(error.message)
        }
    game.value = data
}

const addUserToGame = async () => {
    //create array for existing players
    let existingPlayers = game.value.players

    //add user to array
    let updatedArray = [...existingPlayers, user.value.id]

    const { error: updateError } = await supabase
        .from('grogGameManager')
        .update({ players: updatedArray })
        .eq('id', game.value.id)

    if (updateError) {
        console.log(updateError.message)
        return
    }
}

const findGame = async () => {
    //we are setting the data retuned equal to grogGameManager
    let { data: gameInstance, error } = await supabase
        .from('grogGameManager')
        .select('*')
        .eq('id', joinGameId.value)
        .single()

    if(error) {
        console.log(error.message)
    } else {
        return true
    }
}

const setUpPrompts = async () => {
    //fetch all prompts types from database
    await fetchSingleUsePrompts();
    await fetchTextChallengePrompts();
    await fetchTextDatePrompts();
    shufflePrompts();
    pushPromptsToDatabase();
}

const fetchSingleUsePrompts = async () => {
    const { data, error } = await supabase
        .from('singleUsePrompts')
        .select('*')

    if (error) {
        console.error('Error fetching single use prompts:', error);
        return;
    }

    //select all prompts
    selectRandomPrompts(data, data.length)
}

const fetchTextChallengePrompts = async () => {
    const { data, error } = await supabase
        .from('textChallengePrompts')
        .select('*')

    if (error) {
        console.error('Error fetching text challenge prompts:', error);
        return;
    }

    //randomly select 5 prompts
    selectRandomPrompts(data, 5)

}

const fetchTextDatePrompts = async () => {
    const { data, error } = await supabase
        .from('textDatePrompts')
        .select('*')

    if (error) {
        console.error('Error fetching text date prompts:', error);
        return;
    }

    //randomly select 2 prompts
    selectRandomPrompts(data, 2)
}

const selectRandomPrompts = (promptSet, promptsToSelect) => {
    //randomly select numberOfPrompts
    //add them to the temptPrompts array
    for (let i = 0; i < promptsToSelect; i++) {
        const randomIndex = Math.floor(Math.random() * promptSet.length);
        tempPrompts.value.push(promptSet[randomIndex]);
        //remove the prompt from the tempPrompts array
        promptSet.splice(randomIndex, 1);
    }
}

const shufflePrompts = () => {
    let shuffled = [...tempPrompts.value];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    tempPrompts.value = shuffled;
    return tempPrompts.value;
}

const pushPromptsToDatabase = async () => {
    const { error: updateError } = await supabase
        .from('grogGameManager')
        .update({ gamePrompts: tempPrompts.value })
        .eq('id', game.value.id)

    if (updateError) {
        console.log(updateError.message)
        return
    }
}

const handleUpdates = (payload) => {
    if (payload.new.id === game.value?.id) {
        game.value = payload.new
    }
 }

 // Listen to updates
supabase
    .channel('grogGameManager')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'grogGameManager' }, handleUpdates)
    .subscribe()

const whoseTurn = computed(() => {
    let playerTurn = game.value.turnIndex % players.value.length;
    return players.value[playerTurn].id;
})

const isYourTurn = computed(() => {
    return whoseTurn.value.id === user.value.id;
})

watch(game, (newValue, oldValue) => {
    if (newValue.players.length > players.value.length) {
        addPlayerToPlayersArray();
    } else if (newValue.players.length < players.value.length) {
        removePlayerFromPlayersArray();
    }
}, { deep: true });

const addPlayerToPlayersArray = async () => {
    // id of the new player to add to players array
    const newPlayerId = game.value.players[game.value.players.length - 1]

    // fetch the username for that id
    const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', newPlayerId)

    if (error) {
        console.error('Error fetching usernames:', error);
        return;
    }

    // push the username and id to players.value
    players.value.push( { username: data[0].username, id: newPlayerId } )
}

const removePlayerFromPlayersArray = async () => {
    // search for id of player in players array that is no longer in game.players
    for (let i = 0; i < players.value.length; i++) {
        const currentPlayerId = players.value[i].id
        if (game.value.players.includes(currentPlayerId)) {
            continue
        } else {
            players.value.splice(i, 1)
        }
    }
}


onMounted(() => {
});
</script>
<style scoped>
</style>
