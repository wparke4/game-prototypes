<template>
    <div v-if="gameId">
        Game Id is {{ gameId }}
    </div>
    <div
        class="flex flex-col w-full items-center justify-center gap-9 h-screen space-y-"
        v-if="!gameStarted"
    >
        <div v-if="waitingToStart" >
            <button
                v-if="isGameHost"
                @click="startGame()"
                type="submit"
                class="btn btn-lg btn-success btn-outline w-full"
            >
                Start Game
            </button>
            <div v-else >
                Waiting for host to start game
            </div>
        </div>
        <div
            v-else
            class="flex flex-col w-full items-center justify-center gap-9 h-screen space-y-"
        >
            <button
                @click="createGame()"
                type="submit"
                class="btn btn-lg btn-success btn-outline w-full"
            >
                Create Game
            </button>
            <div
                class="flex flex-col w-full items-center justify-center text-2xl gap-3"
            >
                Join Game
                <p v-if="gameNotFound" class="text-sm pb-2 text-gray-600">
                    Game with code {{ tempJoiningGameId }} does not exist. Please try again.
                </p>
                <input
                    class="input input-md w-1/2 text-left text-black border-warmgray-400"
                    placeholder="Enter Code"
                    v-model="tempJoiningGameId"
                    @keyup.enter="joinGame()"
                    @input="emailSent = false"
                    :disabled="loading"
                >
                <button
                    @click="joinGame()"
                    type="submit"
                    class="btn btn-md btn-success btn-outline w-1/2"
                >
                    Submit
                </button>
            </div>
        </div>
    </div>
</template>




<script setup>
const supabase = useSupabaseClient();
let user = useSupabaseUser();

const gameStarted = useState("gameStarted");
const currentPlayer = useState("currentPlayer")
const yourTurn = useState("yourTurn")
const opponentTurn = useState("opponentTurn")
const waitingToStart = useState("waitingToStart");
const gameCode = ref("");
const tempGameId = ref(null);
const tempJoiningGameId = ref(null);
const gameId = useState("gameId");
const isGameHost = useState("isGameHost")
const userId = ref("")
const isUniqueCode = ref(false)
const gameExists = ref(false)
const gameNotFound = ref(false)

const prompts = ref([]);

const updateTurn = () => {
    //check for player turn
    //compare the current turn player ID against your own ID
    //if they match, set yourTurn to true
    //if they don't match, set opponentTurn to true
};

const startGame = () => {
    //call update turn
    //change "gameStarted" value in table for this game to true and broadcast to all.
};

const createGame = () => {
    createGameId();
    checkGameId().then(async () => {
        if (isUniqueCode.value == true) {
            await createGameRow()
            await addUserToGame()
            await fetchAllPrompts();
            await selectPrompts();
            await insertPrompts();
            waitingToStart.value = true
            isGameHost.value = true
        } else {
            return createGame();
        }

    })
};

const createGameId = () => {
    //pull last game ID and create a new one
    tempGameId.value += 1
    console.log("tempGameId is ", tempGameId.value)
}

const checkGameId = async () => {
    //we are setting the data retuned equal to grogGameManager
    let { data: gameInstance, error } = await supabase
        .from('grogGameManager')
        .select('*')
        .eq('id', tempGameId.value)
        .single()

        if(error) {
            console.log(error.message)
        }
    console.log('checkGameId says gameInstance is ', gameInstance)

    if(!gameInstance) {
        return isUniqueCode.value = true
    } else {
        console.log("game with id of ", tempGameId.value, " already exists")
        return isUniqueCode.value = false
    }
}

const createGameRow = async () => {
    console.log("createGameRow says tempGameId is ", tempGameId.value)
    const { error } = await supabase
            .from('grogGameManager')
            .insert([{ id: tempGameId.value, host: user.value.id }])

        if (error) {
            console.log(error.message)
        } else {
            console.log("row with id ", tempGameId.value, " created")
            gameId.value = tempGameId.value
        }

}

const joinGame = async () => {
    console.log("joinGame says tempJoiningGameId is ", tempJoiningGameId.value)
    findGame().then(async () => {
        if (gameExists.value == true) {
            await addUserToGame()
            waitingToStart.value = true
        } else {
            return gameNotFound.value = true;
        }

    })
    //search for game instance with this code.
    //if game exists, add this user to the player list for this game
    //set "waiting for game start to true"
}

const addUserToGame = async () => {
    console.log("addUserToGame says gameId is ", gameId.value)
    let { data, error: fetchError } = await supabase
        .from('grogGameManager')
        .select('players')
        .eq('id', gameId.value)
        .single()

    if (fetchError) {
        console.log(fetchError)
        return
    }

    let currentArray = data.players
    console.log("currentArray is ", currentArray)

    let updatedArray = []

    if (currentArray) {
        updatedArray = [...currentArray, user.value.id]
    } else {
        updatedArray = [user.value.id]
    }

    console.log("updatedArray is ", updatedArray)

    const { error: updateError } = await supabase
        .from('grogGameManager')
        .update({ players: updatedArray })
        .eq('id', gameId.value)

    if (updateError) {
        console.log(updateError.message)
        return
    } else {
        console.log("user added to game")
    }
}

const findGame = async () => {
    //we are setting the data retuned equal to grogGameManager
    let { data: gameInstance, error } = await supabase
        .from('grogGameManager')
        .select('*')
        .eq('id', tempJoiningGameId.value)
        .single()

        if(error) {
            console.log(error.message)
        }

    if(gameInstance) {
        gameId.value = tempJoiningGameId.value
        return gameExists.value = true
    } else {
        console.log("game with id of ", tempJoiningGameId.value, " does not exist")
        return gameExists.value = false
    }
}

const fetchAllPrompts = () => {
    //fetch all prompts from database
}

const selectPrompts = () => {
    //select the prompts from each category that will be used.
}

const insertPrompts = () => {
    //insert all prompts into database for this game.
}

const fetchPrompts = async () => {
    const { data, error } = await supabase
    .from('prompts')
    .select('*')
    console.log(data)

    if (error) {
    console.error('Error fetching prompts:', error);
    return;
    }

    prompts.value = data;
    console.log(prompts.value[0].text)
};

onMounted(() => {
});
</script>
<style scoped>
</style>
