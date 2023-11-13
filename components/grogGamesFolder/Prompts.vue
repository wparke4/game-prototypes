<template>
    <div
        class="flex flex-col w-full items-center justify-between h-screen space-y-"
    >
        {{ prompts[0]?.text }}
    </div>
</template>




<script setup>
const supabase = useSupabaseClient();

const prompts = ref([]);

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
