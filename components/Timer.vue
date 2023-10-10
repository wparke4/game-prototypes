<template>
  <div>
    <button
        @click="startTimer"
        class="hover:cursor-pointer text-6xl"
    >
        {{ remainingTime }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      initialTime: 30,
      remainingTime: 30,
      timerId: null,
    };
  },
  methods: {
    startTimer() {
      // Clear the previous timer, if any
      if (this.timerId) {
        clearInterval(this.timerId);
      }

      this.remainingTime = this.initialTime;

      this.timerId = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
        } else {
          clearInterval(this.timerId);
          this.timerId = null;
        }
      }, 1000);
    },
  },
  beforeUnmount() {
    // Clear the timer when the component is unmounted
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  },
};
</script>
