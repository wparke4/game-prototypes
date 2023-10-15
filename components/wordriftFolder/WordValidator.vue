<template>

</template>
<script>
export default {
  data() {
      return {
          validWords: new Set(),
          pendingWordObjs: []
      }
  },
  async mounted() {
    try {
      const response = await fetch("/english.txt");
      const text = await response.text();
      const wordsArray = text.split(/\r?\n/);
      this.validWords = new Set(wordsArray);
      } catch (err) {
        console.error("Failed to load word list:", err);
      }
  },
  methods: {
    addTile(tileLetter, rowIndex, colIndex) {
      //console.log('wordValidator says cell populated position: ', cell)
      console.log('wordVaidator says letter populated: ', tileLetter, ' at position: ', rowIndex, colIndex)
      // Create an object for each tile with letter, rowIndex, and colIndex
      const tileObj = {
        letter: tileLetter,
        rowIndex: rowIndex,
        colIndex: colIndex
      }
      this.pendingWordObjs.push(tileObj);
      console.log('wordValidator says pendingWordObjs: ', this.pendingWordObjs)
    }
  }
}
</script>
