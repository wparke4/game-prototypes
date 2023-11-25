<template>
        <div v-if="game" class="flex flex-col">
            <div class="text-xs sm:text-sm pl-3 pt-2">
                Game ID: {{ game.id }}
            </div>
            <div
                class="flex items-center justify-center w-full h-20"
            >
                <div
                    v-for="(player, index) in players"
                    class="flex flex-col justify-center items-center space-y-1 text-center md:w-20 transition ease-in-out rounded-full w-12 h-12"
                    id="player.id"
                    :class="{ currentPlayer: player.isCurrentPlayer }"
                    :style="{ backgroundColor: player.id === currentPlayerId ? 'rgb(128, 255, 128)' : 'white' }"
                >
                <div
                    class="font-medium text-md sm:text-sm md:text-sm w-12 sm:w-auto overflow-hidden text-ellipsis"
                >
                    {{ player.username }}
                </div>
            </div>
        </div>
        </div>
        <div
            v-if="gameStatus === 'inProgress'"
        >
            <div
                v-if="isYourTurn"
                class="flex flex-col w-full items-center justify-center gap-9"
            >
                <div
                    class="text-2xl w-3/4"
                >
                    {{ currentPrompt.text }}
                </div>
                <div
                    class="text-lg w-3/4"
                >
                    {{  currentPrompt.results }}
                </div>
                <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded btn btn-primary w-1/2 sm:w-1/4"
                    @click="endTurn"
                >
                    End Turn
                </button>
            </div>
            <div
                v-else
                class="flex flex-col w-full items-center justify-center text-3xl"
            >
                {{ currentPlayerUsername }}'s turn
            </div>
        </div>
        <div
            v-else-if="gameStatus === 'completed'"
        >

        </div>
        <div
            v-else-if="gameStatus === 'notStarted'"
            class="flex flex-col w-full items-center justify-center"
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
            class="flex flex-col w-full h-full items-center justify-center gap-9"
        >
            <button
                @click="createGame()"
                type="submit"
                class="btn h-20 btn-primary w-1/2"
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
                    class="input input- w-1/2 text-left text-black border-warmgray-400"
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

</template>




<script setup>
const { gameStatus } = utils();

const supabase = useSupabaseClient();
let user = useSupabaseUser();

const waitingToStart = useState("waitingToStart");
const joinGameId = ref(null);
const game = useState("game");
const gameNotFound = ref(false)
const tempPrompts = useState("tempPrompts", () => []);
const players = useState("players", () => []);
const colors = ["red", "blue", "green", "yellow", "purple", "orange"];

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
    await fetchTextLinkPrompts();
    await fetchCategoriesPrompts();
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
const fetchTextLinkPrompts = async () => {
    const { data, error } = await supabase
        .from('textLinkPrompts')
        .select('*')

    if (error) {
        console.error('Error fetching text date prompts:', error);
        return;
    }

    //randomly select 2 prompts
    selectRandomPrompts(data, 2)
}

const fetchCategoriesPrompts = async () => {
    const { data, error } = await supabase
        .from('rrCategoriesPrompts')
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

const currentPlayerUsername = computed(() => {
    if(game.value.gameStatus !== "notStarted") {
        let playerTurn = game.value.turnIndex % players.value.length;
        return players.value[playerTurn].username;
    }
})

const currentPlayerId = computed(() => {
    if(game.value.gameStatus !== "notStarted") {
        let playerTurn = game.value.turnIndex % players.value.length;
        return players.value[playerTurn].id;
    }
})

const isYourTurn = computed(() => {
    if(game.value.gameStatus !== "notStarted") {
        let playerTurn = game.value.turnIndex % players.value.length;
        return players.value[playerTurn].id === user.value.id;
    }
})

const currentPrompt = computed(() => {
    return game.value?.gamePrompts[game.value.turnIndex]
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

const endTurn = async () => {

    const turnIndex = game.value.turnIndex
    const newTurnIndex = turnIndex + 1

    const { data, error } = await supabase
        .from('grogGameManager')
        .update({ turnIndex: newTurnIndex })
        .eq('id', game.value.id)

    if (error) {
        console.log(error.message)
        return
    }
}


onMounted(() => {
});
</script>
<style scoped>
</style>
