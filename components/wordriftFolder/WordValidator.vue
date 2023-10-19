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
          firstWord: true,
          currIndex: 0
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

      const firstTile = this.wordsToValidate[this.currIndex][0]
      const rowIndex = firstTile.rowIndex
      const colIndex = firstTile.colIndex

      for ( let i = 0; i < this.wordsToValidate[this.currIndex].length; i++) {
        if (this.wordsToValidate[this.currIndex][i].rowIndex == rowIndex) {
          matchingRowIndeces++
        }
        if (this.wordsToValidate[this.currIndex][i].colIndex == colIndex) {
          matchingColIndeces++
        }
      }


      if (matchingRowIndeces == this.wordsToValidate[this.currIndex].length) {
          const wordDirection = 'horizontal'
          this.sortLetters(wordDirection)
      } else if (matchingColIndeces == this.wordsToValidate[this.currIndex].length) {
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
          this.wordsToValidate[this.currIndex].sort((a, b) => a.colIndex - b.colIndex)
          this.checkHorizontalGaps(direction)

        } else if (direction == 'vertical') {
          this.wordsToValidate[this.currIndex].sort((a, b) => a.rowIndex - b.rowIndex)
          this.checkVerticalGaps(direction)
        }

        //const pendingString = this.pendingWordObjs.map(tile => tile.letter).join('').toLocaleLowerCase();
        //this.validateWord(pendingString)
    },
    checkHorizontalGaps(direction) {
        const wordArray = this.wordsToValidate[this.currIndex]

        for (let i = 0; i < wordArray.length - 1; i++) {
            if (wordArray[i].colIndex + 1 != wordArray[i + 1].colIndex) {
                console.log('there is a gap in the word')

                this.fillGap(wordArray[i].rowIndex, wordArray[i].colIndex, i, direction)
            } else {
                console.log('there is no gap in the word')
            }
        }

        /*
        const pendingString = this.pendingWordObjs.map(tile => tile.letter).join('').toLocaleLowerCase();
        this.validateWord(pendingString)
        */
    },
    checkVerticalGaps(direction) {
        const wordArray = this.wordsToValidate[this.currIndex]

        for (let i = 0; i < wordArray.length - 1; i++) {
            if (wordArray[i].rowIndex + 1 != wordArray[i + 1].rowIndex) {
                console.log('there is a gap in the word')

                this.fillGap(wordArray[i].rowIndex, wordArray[i].colIndex, i, direction)
            } else {
                console.log('there is no gap in the word')
            }
        }
    },
    fillGap(row, col, index, direction) {
        const wordArray = this.wordsToValidate[this.currIndex]

        if ( direction == 'horizontal') {

            let gapFiller = this.validatedObjs.find(tile => tile.colIndex == col + 1)
            console.log('gapFiller: ', gapFiller)

            // add gapFiller to this.wordsToValidate[this.currIndex] at index + 1
            this.wordsToValidate[this.currIndex].splice(index + 1, 0, gapFiller)
            this.checkHorizontalGaps(direction)

        } else if (direction == 'vertical') {

            let gapFiller = this.validatedObjs.find(tile => tile.rowIndex == row + 1)
            console.log('gapFiller: ', gapFiller)

            // add gapFiller to this.wordsToValidate[this.currIndex] at index + 1
            this.wordsToValidate[this.currIndex].splice(index + 1, 0, gapFiller)
            this.checkVerticalGaps(direction)

        } else {
            console.log('direction is not horizontal or vertical')
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
