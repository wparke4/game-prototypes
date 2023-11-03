<template>
    <div
        class="flex flex-col items-center justify-center h-screen"
    >
        <div class="prompt">
          <p>{{ currentPrompt.text }}</p>
          <p class="type">{{ currentPrompt.type }}</p>
        </div>
        <button @click="loadNextPrompt">
            Next Prompt
        </button>
    </div>
</template>

<script>

export default {
  data() {
    return {
      prompts: [],
      currentPromptIndex: 0,
    };
  },
  async created() {
    const response = await fetch('/grogGamesPrompts.json');
    this.prompts = await response.json();
    this.shufflePrompts();
  },
  computed: {
    currentPrompt() {
      return this.prompts.length ? this.prompts[this.currentPromptIndex] : { text: '', type: '' };
    }
  },
  methods: {
      shufflePrompts() {
          let currentIndex = this.prompts.length, temporaryValue, randomIndex;

          // While there remain elements to shuffle...
          while (0 !== currentIndex) {

              // Pick a remaining element...
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;

              // And swap it with the current element.
              temporaryValue = this.prompts[currentIndex];
              this.prompts[currentIndex] = this.prompts[randomIndex];
              this.prompts[randomIndex] = temporaryValue;
          }
    },
    loadNextPrompt() {
        this.currentPromptIndex = (this.currentPromptIndex + 1) % this.prompts.length;
    },
  },
};
</script>
<style scoped>
</style>
