<template>
    <div
        class="flex flex-col items-center justify-center text-2xl pb-3"
    >
        <p>{{ time }}</p>
    </div>
</template>

<script>
export default {
  data() {
      return {
          time: 0,
          timer: null,
          timerStarted: false
      }
  },
  methods: {
    startTimer() {
        if (this.timerStarted) return;
        this.timerStarted = true;
        this.timer = setInterval(() => {
          this.time++;
        }, 1000);
    },
    stopTimer() {
        clearInterval(this.timer);
        this.timer = null;
    }
  }
}
</script>
