<template>
    <div
        class="flex flex-col w-full items-center justify-between h-screen space-y-"
        v-if="gameStarted"
    >
        {{ prompts[0]?.text }}
    </div>
    <div
        class="flex flex-col w-full items-center justify-between h-screen space-y-"
        v-else
    >
        {{ currentPlayer }}
    </div>
</template>




<script setup>
const supabase = useSupabaseClient();
const gameStarted = useState("gameStarted");

const prompts = ref([]);
const currentPlayer = ref('current player')

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
    fetchPrompts();
});
</script>
<style scoped>
</style>
