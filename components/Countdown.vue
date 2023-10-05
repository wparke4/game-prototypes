<template>
  <div class="countdown">
    <div v-if="!done">
      <small class="text-sm text-bold mb-3 block uppercase">The 5 Games start in...</small>
      <div class="flex items-center justify-center mb-12">
        <div class="slot">
          <div>{{ twoDigits(days) }}</div>
          <span>days</span>
        </div>
        <div class="slot">
          <div>{{ twoDigits(hours) }}</div>
          <span>hrs</span>
        </div>
        <div class="slot">
          <div>{{ twoDigits(minutes) }}</div>
          <span>min</span>
        </div>
        <div class="slot">
          <div>{{ twoDigits(seconds) }}</div>
          <span>sec</span>
        </div>
      </div>
      <div class="pb-10 flex flex-col sm:flex-row justify-center items-center space-y-5 sm:space-y-0 sm:space-x-6">
        <a @click="outboundLink('https://opensea.io/collection/internet-game-token')"
          class="btn btn-lg btn-default cursor-pointer uppercase"
          >Buy Game Token</a
        >
        <a
          @click="outboundLink('https://discord.gg/' + discordInviteLink)"
          class="btn btn-lg btn-default cursor-pointer uppercase"
          >Discord</a>
      </div>
    </div>
    <div v-else class="pb-20">
      <div class="pb-10 flex flex-col sm:flex-row justify-center items-center space-y-5 sm:space-y-0 sm:space-x-6">
        <a @click="outboundLink('https://play.internet.game')"
          class="btn btn-lg btn-default cursor-pointer uppercase"
          >See Results</a
        >
        <a
          @click="outboundLink('https://discord.gg/' + discordInviteLink)"
          class="btn btn-lg btn-default cursor-pointer uppercase"
          >Discord</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    mounted() {
      window.setInterval(() => {
          this.now = Math.trunc((new Date()).getTime() / 1000);
      },1000);
    },
    props: ['date', 'size'],
    data() {
      return {
        now: Math.trunc((new Date()).getTime() / 1000),
        discordInviteLink: "nQPjVEahAx"
      }
    },
    methods: {
      outboundLink(link) {
        this.$ga.event("Outbound", "Click", "Discord", link);
        window.open(link, "_blank");
      },
      twoDigits(value) {
        if (value < 0) {
          return '00';
        }
        if (value.toString().length <= 1) {
          return `0${value}`;
        }
        return value;
      }
    },
    computed: {
      done () {
        return this.dateInMilliseconds <= this.now
      },
      dateInMilliseconds() {
        return Math.trunc(Date.parse(this.date) / 1000)
      },
      seconds() {
        return (this.dateInMilliseconds - this.now) % 60;
      },
      minutes() {
        return Math.trunc((this.dateInMilliseconds - this.now) / 60) % 60;
      },
      hours() {
        return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60) % 24;
      },
      days() {
        return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60 / 24);
      }
    }
  }
</script>

<style lang="postcss" scoped>
.countdown {
  min-height: 50px;

  @screen xs {
    min-height: 70px;
  }

  @screen sm {
    min-height: 80px;
  }

  .slot {
    width: 65px;

    @screen xs {
      width: 70px;
    }

    @screen sm {
      width: 130px;
    }

    div {
      @apply text-xl xs:text-3xl sm:text-5xl pb-1 text-center leading-none font-bold;
    }

    span {
      @apply text-sm sm:text-base text-center block opacity-50 uppercase;
    }
  }
}
</style>
