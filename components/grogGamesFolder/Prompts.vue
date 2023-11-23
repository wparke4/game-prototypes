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
    fetchSingleUsePrompts();
    fetchTextChallengePrompts();
    fetchTextDatePrompts();
};

const fetchSingleUsePrompts = async () => {
    const { data, error } = await supabase
        .from('singleUsePrompts')
        .select('*')
    console.log("sinlge use prompts: ", data)

    if (error) {
    console.error('Error fetching single use prompts:', error);
    return;
    }

    prompts.value = data;
}

const fetchTextChallengePrompts = async () => {
    const { data, error } = await supabase
        .from('textChallengePrompts')
        .select('*')
    console.log("text challenge prompts: ", data)

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
    console.log("text date prompts: ", data)

    if (error) {
    console.error('Error fetching text date prompts:', error);
    return;
    }

    //randomly select 2 prompts
    selectRandomPrompts(data, 2)
}

const selectRandomPrompts = (tempPrompts, promptsToSelect) => {
    //randomly select numberOfPrompts
    //add them to the prompts array
    for (let i = 0; i < promptsToSelect; i++) {
        const randomIndex = Math.floor(Math.random() * tempPrompts.length);
        prompts.value.push(tempPrompts[randomIndex]);
        console.log("prompt added: ", tempPrompts[randomIndex])
        //remove the prompt from the tempPrompts array
        tempPrompts.splice(randomIndex, 1);
    }
}


onMounted(() => {
    fetchPrompts();
});
</script>
<style scoped>
</style>
