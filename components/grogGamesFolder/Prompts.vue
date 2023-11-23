<template>
    <div>
    </div>
</template>




<script setup>
const supabase = useSupabaseClient();
const gameStarted = useState("gameStarted");
const currentPlayer = useState("currentPlayer")
const gameCreated = useState("gameCreated")
const yourTurn = useState("yourTurn")
const opponentTurn = useState("opponentTurn")
const gameId = useState("gameId");
const prompts = useState("prompts")
const turnIndex = useState("turnIndex")

watch(gameCreated, (newValue, oldValue) => {
  if (newValue === true) {
    //fetches all possible prompts, selects which to use then shuffles and pushes to database
    fetchRawPrompts();
  }
});

const updateTurn = () => {
    //check for player turn
    //compare the current turn player ID against your own ID
    //if they match, set yourTurn to true
    //if they don't match, set opponentTurn to true
}

const fetchRawPrompts = async () => {
    await fetchSingleUsePrompts();
    await fetchTextChallengePrompts();
    await fetchTextDatePrompts();
    shufflePrompts();
    pushPromptsToDatabase();
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

const shufflePrompts = () => {
    console.log("prompts before shuffle: ", prompts.value)
    console.log("prompts length: ", prompts.value.length)
    //shuffle the prompts array
    for (let i = prompts.value.length - 1; i > 0; i--) {
        // Generate a random index before the current element (inclusive)
        const j = Math.floor(Math.random() * (i + 1));

        let temp = prompts.value[i];
        prompts.value[i] = prompts.value[j];
        prompts.value[j] = temp;
        console.log(prompts.value[i], prompts.value[j], "swapped")
    }
    console.log("prompts after shuffle: ", prompts.value)
    return prompts.value;
}

const pushPromptsToDatabase = async () => {
    const { error: updateError } = await supabase
        .from('grogGameManager')
        .update({ gamePrompts: prompts.value })
        .eq('id', gameId.value)

    if (updateError) {
        console.log(updateError.message)
        return
    } else {
        console.log("prompts added to game")
    }
}


onMounted(() => {
});
</script>
<style scoped>
</style>
