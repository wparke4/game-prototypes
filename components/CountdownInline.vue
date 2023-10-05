<template>
  <div class="countdown inline text-2xl sm:text-xl">
   <div v-if="days" class="slot">
      <div>{{ format(days) }}<span>d</span></div>
    </div>
    <div v-if="hours" class="slot">
      <div>{{ format(hours) }}<span>hr</span></div>
    </div>
    <div class="slot">
      <div>{{ format(minutes) }}<span>m</span></div>
    </div>
    <div class="slot">
      <div>{{ format(seconds) }}<span>s</span></div>
    </div>
  </div>
</template>

<script>
var moment = require("moment");

export default {
  mounted() {
    window.setInterval(() => {
      this.now = moment().unix()
    }, 1000);
  },
  props: ["date", "size"],
  data() {
    return {
      now: Math.trunc(new Date().getTime() / 1000),
    };
  },
  methods: {
    format(value) {
      if (value < 0) {
        return "0";
      }
      if (value.toString().length <= 1) {
        return `${value}`;
      }
      return value;
    },
    twoDigits(value) {
      if (value < 0) {
        return "00";
      }
      if (value.toString().length <= 1) {
        return `0${value}`;
      }
      return value;
    },
  },
  computed: {
    unixDate() {
      return moment(this.date).unix()
    },
    seconds() {
      return (this.unixDate - this.now) % 60;
    },
    minutes() {
      return Math.trunc((this.unixDate - this.now) / 60) % 60;
    },
    hours() {
      return Math.trunc((this.unixDate - this.now) / 60 / 60) % 24;
    },
    days() {
      return Math.trunc((this.unixDate - this.now) / 60 / 60 / 24);
    },
  },
};
</script>

<style lang="postcss" scoped>
.countdown {
  .slot {
    @apply inline pr-1;

    div {
      @apply inline-block;
    }

    span {
      margin-left: 1px;
    }
  }
}
</style>
