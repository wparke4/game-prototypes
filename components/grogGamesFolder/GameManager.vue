<template>
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
                <input
                    class="input input-md w-1/2 text-left text-black border-warmgray-400"
                    placeholder="Enter Code"
                    v-model="gameCode"
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
const waitingToStart = ref(false);
const gameCode = ref("");
const gameId = useState("gameId");
const tempGameId = ref("");
const isGameHost = useState("isGameHost")
const userId = ref("")

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
    checkGameId();
    fetchAllPrompts();
    selectPrompts();
    insertPrompts();
    waitingToStart.value = true
    isGameHost.value = true
};

const createGameId = () => {
    //pull last game ID and create a new one
    tempGameId.value = 1
}

const checkGameId = async () => {
    console.log("user id is ", user.value.id)
    //we are setting the data retuned equal to grogGameManager
    let { data: gameInstance, error } = await supabase
        .from('grogGameManager')
        .select('*')
        .eq('id', 4)
        .single()

        if(error) {
            console.log(error.message)
        }

    if(!gameInstance) {
        const { error } = await supabase
            .from('grogGameManager')
            .insert([{ id: 4, host: user.value.id }])

        if (error) {
            console.log(error.message)
        } else {
            console.log("row with id 3 created")
        }
    }
}

const createGameRow = () => {
    //check if game with this code already exists in game table
        //if exists, return and call createGameId again
        //if doesn't exist, create new game with this code.
            //set gameId to this Id.

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

const joinGame = () => {
    //search for game instance with this code.
    //if game exists, add this user to the player list for this game
    //set "waiting for game start to true"
    waitingToStart.value = true
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
