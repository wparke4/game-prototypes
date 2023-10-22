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
          currIndex: 0,
          direction: null
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
        const bool = this.startingColCheck()
        if (!bool) {
          // to do: call function that rejects the word
          return
        }
      }

      this.findWordDirection();

      if (this.direction == 'horizontal') {
          this.horizontalWordHandler();
      } else if (this.direction == 'vertical') {
          this.verticalWordHandler();
      } else if (this.direction == null) {
          console.log('direction is not horizontal or vertical')
          // to do: call a function that rejects the word
          return
      }
    },
    horizontalWordHandler() {
        this.sortLetters();
        const colGaps = this.checkHorizontalGaps();
        if (colGaps.length > 0) {
            const bool = this.fillColGaps(colGaps)
            if (!bool) {
                // to do: call function that rejects the word
                return
            }
        }
        this.validateWord();
    },
    verticalWordHandler() {
        this.sortLetters();
        const rowGaps = this.checkVerticalGaps();
        if (rowGaps.length > 0) {
            console.log('rowGaps: ', rowGaps)
            return
        }
    },
    startingColCheck() {
      //check to ensure that one of the tiles is placed at row index 5, col index 0
      const firstColTile = this.wordsToValidate[0].find(tile => tile.colIndex == 0);

      if (firstColTile) {
        console.log('firstCol is occupied')
        return true;
      } else {
        console.log('firstCol is not occupied')
        return false;
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
          this.direction = 'horizontal'
          //this.sortLetters(wordDirection)
      } else if (matchingColIndeces == this.wordsToValidate[this.currIndex].length) {
          this.direction = 'vertical'
          //this.sortLetters(wordDirection)
      } else {
          console.log('word is not horizontal or vertical')
          return;
      }
    },
    sortLetters() {
        // sort the pendingWordObjs by rowIndex or colIndex depending on direction
        if (this.direction == 'horizontal') {
          this.wordsToValidate[this.currIndex].sort((a, b) => a.colIndex - b.colIndex)
        } else
        if (this.direction == 'vertical') {
          this.wordsToValidate[this.currIndex].sort((a, b) => a.rowIndex - b.rowIndex)
        }
    },
    checkHorizontalGaps() {
        const wordArray = this.wordsToValidate[this.currIndex]

        const startingCol = wordArray[0].colIndex
        const finalCol = wordArray[wordArray.length - 1].colIndex
        const length = finalCol - startingCol

        const gapColumns = []


        for (let i = 0; i < length; i++) {
            const tile = wordArray.find(tile => tile.colIndex == startingCol + i)
            if (tile == null) {
                gapColumns.push(startingCol + i)
            }
        }

        return gapColumns;

        /*
        const pendingString = this.wordsToValidate[this.currIndex].map(tile => tile.letter).join('').toLocaleLowerCase();
        this.validateWord(pendingString)
        */
    },
    checkVerticalGaps() {
        const wordArray = this.wordsToValidate[this.currIndex]

        for (let i = 0; i < wordArray.length - 1; i++) {
            if (wordArray[i].rowIndex + 1 != wordArray[i + 1].rowIndex) {

                console.log('there is a gap in the word')
                this.fillGap(wordArray[i].rowIndex, wordArray[i].colIndex, i)

            } else {
                console.log('there is no gap in the word')
            }
        }

        const pendingString = this.wordsToValidate[this.currIndex].map(tile => tile.letter).join('').toLocaleLowerCase();
        this.validateWord(pendingString)
    },
    fillGap(row, col, index) {
        const wordArray = this.wordsToValidate[this.currIndex]

        if ( this.direction == 'horizontal') {

            let gapFiller = this.validatedObjs.find(tile => tile.colIndex == col + 1 && tile.rowIndex == row)
            console.log('gapFiller: ', gapFiller)

            // add gapFiller to this.wordsToValidate[this.currIndex] at index + 1
            this.wordsToValidate[this.currIndex].splice(index + 1, 0, gapFiller)
            this.checkHorizontalGaps()

        } else if (this.direction == 'vertical') {

            let gapFiller = this.validatedObjs.find(tile => tile.rowIndex == row + 1 && tile.colIndex == col)
            console.log('gapFiller: ', gapFiller)

            // add gapFiller to this.wordsToValidate[this.currIndex] at index + 1
            this.wordsToValidate[this.currIndex].splice(index + 1, 0, gapFiller)
            this.checkVerticalGaps()

        } else {
            console.log('direction is not horizontal or vertical')
        }
    },
    fillColGaps(gapsArray) {
        const wordArray = this.wordsToValidate[this.currIndex]
        const row = wordArray[0].rowIndex

        for (let i = 0; i < gapsArray.length; i++) {
            let gapFiller = this.validatedObjs.find(tile => tile.colIndex == gapsArray[i] && tile.rowIndex == row)
            console.log('gapFiller: ', gapFiller)

            if (gapFiller == null) {
                console.log('there is no tile to fill gap at col index: ', gapsArray[i])
                return false
            }

            // add gapFiller to this.wordsToValidate[this.currIndex] at index + 1
            this.wordsToValidate[this.currIndex].splice(i + 1, 0, gapFiller)
        }
    },
    beforeWordCheck() {
        // to do: check if there are any letters before or after the word
        const word = this.wordsToValidate[this.currIndex]
        const firstTile = word[0]
        if ( this.direction == 'horizontal' ) {

            const beforeTile = this.validatedObjs.find(tile => tile.rowIndex == firstTile.rowIndex && tile.colIndex == firstTile.colIndex - 1)
            if (beforeTile) {
                console.log('there is a tile before the word')
                this.wordsToValidate[this.currIndex].unshift(beforeTile)
            }
        } else if ( this.direction == 'vertical' ) {
            const beforeTile = this.validatedObjs.find(tile => tile.rowIndex == firstTile.rowIndex - 1 && tile.colIndex == firstTile.colIndex)
            if (beforeTile) {
                console.log('there is a tile before the word')
                this.wordsToValidate[this.currIndex].unshift(beforeTile)
            }
        } else {
            console.log('direction is not horizontal or vertical')
        }
    },
    validateWord() {
        const currentWord = this.wordsToValidate[this.currIndex].map(tile => tile.letter).join('').toLocaleLowerCase();

        if (this.validWords.has(currentWord)) {
            console.log('Valid word: ', currentWord);
            if (this.firstWord) {
              this.firstWord = false
            }
            this.$emit('word-validated', currentWord);
            this.pendingWordObjs.forEach(tile => this.validatedObjs.push(tile))
            this.pendingWordObjs = []
            this.wordsToValidate = []
            console.log('validatedWords: ', this.validatedObjs)
        } else {
            console.log('Invalid word: ', currentWord);
        }
      }
  }
}
</script>
