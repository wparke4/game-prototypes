<template>
    <div class="w-full max-w-[66vw] mx-auto mb-8 md:max-w-[30vw]">
      <input
        :value="modelValue"
        @input="updateValue"
        type="range"
        :min="min"
        :max="max"
        class="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  </template>

  <script setup>
  import { defineProps, defineEmits } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      required: true
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const updateValue = (event) => {
    emit('update:modelValue', Number(event.target.value))
  }
  </script>
