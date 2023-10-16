<template>

</template>
<script>
export default {
  data() {
      return {
          validWords: new Set(),
          pendingWordObjs: [],
          validatedObjs: [],
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
        colIndex: colIndex,
      }
      this.pendingWordObjs.push(tileObj);
    },
    removeTile(rowIndex, colIndex) {
      // find the obj in pendingWordObjs that matches the rowIndex, and colIndex
      const tileObj = this.pendingWordObjs.find(tile => tile.rowIndex == rowIndex && tile.colIndex == colIndex);

      //remove tileObj from pendingWordObjs
      const index = this.pendingWordObjs.indexOf(tileObj);
      if (index > -1) {
        this.pendingWordObjs.splice(index, 1);
      }
    },
    submitWord() {
      if (this.firstWord) {
        this.startingCellCheck()
      } else {
        this.findWordDirection()
      }
    },
    startingCellCheck() {
      console.log('wordValidator says pendingWordObjs: ', this.pendingWordObjs)
      //check to ensure that one of the tiles is placed at row index 5, col index 0
      const firstTile = this.pendingWordObjs.find(tile => tile.rowIndex == 5 && tile.colIndex == 0);
      if (firstTile) {
        console.log('firstTile is occupied')
        this.findWordDirection()
      } else {
        console.log('firstTile is not occupied')
        // to do: call rejection function
      }
    },
    findWordDirection() {
      //to do: check if word is horizontal or vertical
      let matchingRowIndeces = 0
      let matchingColIndeces = 0

      const firstTile = this.pendingWordObjs[0]
      const rowIndex = firstTile.rowIndex
      const colIndex = firstTile.colIndex

      for (let i = 0; i < this.pendingWordObjs.length; i++) {
        if (this.pendingWordObjs[i].rowIndex == rowIndex) {
          matchingRowIndeces++
        }
        if (this.pendingWordObjs[i].colIndex == colIndex) {
          matchingColIndeces++
        }
      }

      if (matchingRowIndeces == this.pendingWordObjs.length) {
        const wordDirection = 'horizontal'
        this.createWordString(wordDirection)
      } else if (matchingColIndeces == this.pendingWordObjs.length) {
        const wordDirection = 'vertical'
        this.createWordString(wordDirection)
      } else {
        console.log('word is not horizontal or vertical')
        //to do: call a function that removes all tiles from grid and puts them back in tile rack
      }
    },
    createWordString(direction) {
        // sort the pendingWordObjs by rowIndex or colIndex depending on direction
        if (direction == 'horizontal') {
          this.pendingWordObjs.sort((a, b) => a.colIndex - b.colIndex)
        } else if (direction == 'vertical') {
          this.pendingWordObjs.sort((a, b) => a.rowIndex - b.rowIndex)
        }

        const pendingString = this.pendingWordObjs.map(tile => tile.letter).join('').toLocaleLowerCase();
        this.validateWord(pendingString)
    },
    validateWord(word) {
      if (this.validWords.has(word)) {
          console.log('Valid word: ', word);
          if (this.firstWord) {
            this.firstWord = false
          }
          this.$emit('word-validated', word);
          this.pendingWordObjs.forEach(tile => this.validatedObjs.push(tile))
          this.pendingWordObjs = []
      } else {
          console.log('Invalid word: ', word);
      }
    }
  }
}
</script>
