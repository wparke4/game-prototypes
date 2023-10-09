<template>
  <div
    class="flex flex-row justify-between w-full space-x-10"
  >
      <div
          class="flex flex-col items-center justify-center"
      >
          <button
              class="border border-gray-500 rounded-md h-16 w-40 hover:bg-indigo-200 cursor-pointer"
          >
              {{ TeamA}}
          </button>
          <button
              @click="updateScoreA($event)"
              class="text-3xl"
          >
              {{ scoreA }}
          </button>
      </div>
      <div
          class="flex flex-col items-center justify-center"
        >
          <button
            class="border border-gray-500 rounded-md h-16 w-40 hover:bg-indigo-200 cursor-pointer"
          >
              {{ TeamB }}
          </button>
          <button
              @click="updateScoreB($event)"
              class="text-3xl"
          >
              {{ scoreB }}
          </button>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scoreA: 0,
      scoreB: 0
    }
  },
  methods: {
    updateScoreA(event) {
      // Check if it's a left click (event.button === 0) and increment the integer
      if (event.button === 0) {
        if (event.metaKey || event.ctrlKey) {
          // Decrement if the Command (Mac) or Ctrl (Windows) key is held
          if (this.scoreA> 0) {
            this.scoreA--;
          }
        } else {
          // Increment by default on a left click
          this.scoreA++;
        }
      }
    },
    updateScoreB(event) {
      // Check if it's a left click (event.button === 0) and increment the integer
      if (event.button === 0) {
        if (event.metaKey || event.ctrlKey) {
          // Decrement if the Command (Mac) or Ctrl (Windows) key is held
          if (this.scoreB> 0) {
            this.scoreB--;
          }
        } else {
          // Increment by default on a left click
          this.scoreB++;
        }
      }
    },
  },
}
</script>
