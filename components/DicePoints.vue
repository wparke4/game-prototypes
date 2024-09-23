<template>
    <div>
        <h2 class="text-left text-xl fond-bold mb-2">
            {{  title }}
        </h2>
        <div class="border border-gray-300 p-4 rounded-lg flex justify-center">
            <div class="flex flex-col items-center mr-10">
                <p class="text-sm text-gray-600">Points</p>
                <span class="text-3xl font-bold">{{ points }}</span>
            </div>
            <div class="flex flex-col items-center">
                <p class="text-sm text-gray-600">Skulls</p>
                <div class="flex space-x-2 mt-1">
                    <div v-for="i in 3" :key="i" class="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    }
})

</script>
