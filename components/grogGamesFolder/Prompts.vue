<template>
    <div
        class="flex flex-col w-full items-center justify-between h-screen space-y-"
        v-if="yourTurn"
    >
        {{ prompts[0]?.text }}
    </div>
    <div
        class="flex flex-col w-full items-center justify-between h-screen space-y-"
        v-else-if="opponentTurn"
    >
        {{ currentPlayer }}
    </div>
</template>




<script setup>
const supabase = useSupabaseClient();
const gameStarted = useState("gameStarted");
const currentPlayer = useState("currentPlayer")
const gameCreated = useState("gameCreated")
const yourTurn = useState("yourTurn")
const opponentTurn = useState("opponentTurn")

watch(gameCreated, (newValue, oldValue) => {
  if (newValue === true) {
    fetchPrompts();
  }
});

const prompts = ref([]);

const updateTurn = () => {
    //check for player turn
    //compare the current turn player ID against your own ID
    //if they match, set yourTurn to true
    //if they don't match, set opponentTurn to true
}

const fetchPrompts = async () => {
    console.log("fetching prompts")
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
    fetchPrompts();
});
</script>
<style scoped>
</style>
