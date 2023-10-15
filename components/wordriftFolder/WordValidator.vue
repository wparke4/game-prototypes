<template>

</template>
<script>
export default {
  data() {
      return {
          validWords: new Set(),
          pendingWordObjs: [],
          firstWord: true
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
      // Create an object for each tile with letter, rowIndex, and colIndex
      const tileObj = {
        letter: tileLetter,
        rowIndex: rowIndex,
        colIndex: colIndex
      }
      this.pendingWordObjs.push(tileObj);
    },
    submitWord() {
      if (this.firstWord) {
        this.startingCellCheck()
      }
    },
    startingCellCheck() {
      console.log('wordValidator says pendingWordObjs: ', this.pendingWordObjs)
      //check to ensure that one of the tiles is placed at row index 5, col index 0
      const firstTile = this.pendingWordObjs.find(tile => tile.rowIndex == 5 && tile.colIndex == 0);
      if (firstTile) {
        console.log('firstTile is occupied')
      } else {
        console.log('firstTile is not occupied')
      }
    }
  }
}
</script>
