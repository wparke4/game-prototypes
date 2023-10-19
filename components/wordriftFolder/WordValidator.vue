<template>

</template>
<script>
export default {
  data() {
      return {
          validWords: new Set(),
          pendingWordObjs: [],
          wordsToValidate: [],
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
      // push all letters to wordsToValidate
      this.wordsToValidate.push(this.pendingWordObjs)

      // to do - push all letters separately to their own index of wordsToValidate for adjacent check

      if (this.firstWord) {
        this.startingCellCheck()
      } else {
        this.findWordDirection()
      }
    },
    startingCellCheck() {
      //check to ensure that one of the tiles is placed at row index 5, col index 0
      const firstColTile = this.wordsToValidate[0].find(tile => tile.colIndex == 0);

      if (firstColTile) {
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

      const firstTile = this.wordsToValidate[0][0]
      const rowIndex = firstTile.rowIndex
      const colIndex = firstTile.colIndex

      for ( let i = 0; i < this.wordsToValidate[0].length; i++) {
        if (this.wordsToValidate[0][i].rowIndex == rowIndex) {
          matchingRowIndeces++
        }
        if (this.wordsToValidate[0][i].colIndex == colIndex) {
          matchingColIndeces++
        }
      }


      if (matchingRowIndeces == this.wordsToValidate[0].length) {
          const wordDirection = 'horizontal'
          this.sortLetters(wordDirection)
      } else if (matchingColIndeces == this.wordsToValidate[0].length) {
          const wordDirection = 'vertical'
          this.sortLetters(wordDirection)
      } else {
          console.log('word is not horizontal or vertical')
          //to do: call a function that removes all tiles from grid and puts them back in tile rack
      }
    },
    sortLetters(direction) {
        // sort the pendingWordObjs by rowIndex or colIndex depending on direction
        if (direction == 'horizontal') {
          this.wordsToValidate[0].sort((a, b) => a.colIndex - b.colIndex)
          this.checkHorizontalGaps()

        } else if (direction == 'vertical') {
          this.wordsToValidate[0].sort((a, b) => a.rowIndex - b.rowIndex)
          this.checkVerticalGaps()
        }

        //const pendingString = this.pendingWordObjs.map(tile => tile.letter).join('').toLocaleLowerCase();
        //this.validateWord(pendingString)
    },
    checkHorizontalGaps() {
        const wordArray = this.wordsToValidate[0]

        for (let i = 0; i < wordArray.length - 1; i++) {
            if (wordArray[i].colIndex + 1 != wordArray[i + 1].colIndex) {
                console.log('there is a gap in the word')
                //to do: call a function that removes all tiles from grid and puts them back in tile rack
            } else {
                console.log('there is no gap in the word')
            }
        }

        /*
        const pendingString = this.pendingWordObjs.map(tile => tile.letter).join('').toLocaleLowerCase();
        this.validateWord(pendingString)
        */
    },
    checkVerticalGaps() {
        const wordArray = this.wordsToValidate[0]

        for (let i = 0; i < wordArray.length - 1; i++) {
            if (wordArray[i].rowIndex + 1 != wordArray[i + 1].rowIndex) {
                console.log('there is a gap in the word')
                //to do: call a function that removes all tiles from grid and puts them back in tile rack
            } else {
                console.log('there is no gap in the word')
            }
        }
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
          console.log('validatedWords: ', this.validatedObjs)
      } else {
          console.log('Invalid word: ', word);
      }
    }
  }
}
</script>
