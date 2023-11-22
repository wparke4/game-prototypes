<template>
    <div
        v-if="yourTurn"
    >
        <div v-if="turnStarted">
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                @click="endTurn"
            >
                End Turn
            </button>
        </div>
        <div v-else>
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                @click="startTurn"
            >
                Start Turn
            </button>
        </div>
    </div>
    <div
        v-else
    >
        {{ currentPlayer }}'s turn
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
onMounted(() => {
});
</script>
<style scoped>
</style>
