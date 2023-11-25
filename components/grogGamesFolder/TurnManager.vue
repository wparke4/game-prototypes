<template>
    <div
        v-if="yourTurn"
    >
        <div v-if="turnStarted">
            <div>
                {{ prompts[promptIndex].text }}
            </div>
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                @click="endTurn"
            >
                End Turn
            </button>
        </div>
        <div v-else class="flex flex-col w-full items-center justify-center gap-9">
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
const players = useState("players")
const yourTurn = useState("yourTurn")
const turnStarted = useState("turnStarted")
const opponentTurn = useState("opponentTurn")
const waitingToStart = useState("waitingToStart");
const gameCode = ref("");
const tempGameId = ref(null);
const tempJoiningGameId = ref(null);
const gameId = useState("gameId");
const isGameHost = useState("isGameHost")
const isUniqueCode = ref(false)
const gameExists = ref(false)
const gameNotFound = ref(false)
const prompts = useState("prompts")
const turnIndex = useState("turnIndex")
const promptIndex = useState("promptIndex")
const game = useState("game")

const startTurn = () => {
    console.log("turnIndex.value", turnIndex.value)
    console.log("prompts.value", prompts.value)
    console.log("turn started, prompts.value[promptIndex.value].text",  prompts.value[promptIndex.value].text)
    turnStarted.value = true
}

const endTurn = async () => {
    turnStarted.value = false

    turnIndex.value = turnIndex.value + 1

    const { data, error } = await supabase
        .from('grogGameManager')
        .update({ turnIndex: turnIndex.value })
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
