// IntegerInput.vue
<template>
  <div
    class="flex flex-col items-center justify-center"
  >
    <input
        class="border border-gray-500 rounded-md h-8 w-32 text-center"
        type="number"
        v-model="inputValue"
        min="1"
        max="100"
        placeholder="Enter seed"
    />
    <button
        @click="submit"
        class="border border-gray-500 rounded-md h-8 w-32 hover:bg-indigo-200 cursor-pointer"
    >
        Submit
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: null,
    };
  },
  methods: {
    submit() {
      // Check if inputValue is a valid integer within the range
      const integer = parseInt(this.inputValue, 10);
      if (!isNaN(integer) && integer >= 1 && integer <= 100) {
        // Emit an event to notify the parent component of the submitted integer
        this.$emit("submit", integer);
      } else {
        // Display an error or feedback message to the user
        // For example, set an error message in data and display it in the template
      }
    },
  },
};
</script>
