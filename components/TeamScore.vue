<template>
  <div
    class="flex flex-row justify-between w-full space-x-10"
  >
      <div
          class="flex flex-col items-center justify-center"
      >
          <button
              id="teamA"
              class="border border-gray-500 rounded-md h-16 w-40 hover:bg-indigo-200 cursor-pointer text-3xl"
              :class="{ 'yellow-background': activeTeam === 'A' }"
              @click="setActiveTeam('A')"
          >
              {{ TeamA }}
          </button>
          <button
              @click="updateScoreA($event)"
              class="text-5xl pt-3"
          >
              {{ scoreA }}
          </button>
      </div>
      <Timer />
      <div
          class="flex flex-col items-center justify-center"
        >
          <button
              id="teamB"
              class="border border-gray-500 rounded-md h-16 w-40 hover:bg-indigo-200 cursor-pointer text-3xl"
              :class="{ 'yellow-background': activeTeam === 'B' }"
              @click="setActiveTeam('B')"
          >
              {{ TeamB }}
          </button>
          <button
              @click="updateScoreB($event)"
              class="text-5xl pt-3"
          >
              {{ scoreB }}
          </button>
      </div>
  </div>
</template>

<script>
import Timer from "@/components/Timer.vue";
export default {
  data() {
    return {
      scoreA: 0,
      scoreB: 0,
      TeamA: "Sassys",
      TeamB: "Classys",
      activeTeam: "A"
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
    setActiveTeam(team) {
      if (this.activeTeam != team) {
        // Emit a custom event named "updateActiveTeam" with the active team data
        this.activeTeam = team;
        this.$emit("updateActiveTeam", team);
      }
    },
  },
}
</script>

<style scoped>
.yellow-background {
  background-color: #f7faa4; /* Adjust the color code to your desired shade of green */
}
</style>
