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
          direction: null,
          perpendicularDirection: null
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
      console.log('wordValidator says rowIndex: ', rowIndex, ' colIndex: ', colIndex)
      // find the obj in pendingWordObjs that matches the rowIndex, and colIndex
      const tileObj = this.pendingWordObjs.find(tile => tile.rowIndex == rowIndex && tile.colIndex == colIndex);
      console.log('wordValidator says tileObj: ', tileObj)

      //remove tileObj from pendingWordObjs
      const index = this.pendingWordObjs.indexOf(tileObj);
      if (index > -1) {
        this.pendingWordObjs.splice(index, 1);
      }
      console.log('wordValidator says pendingWordObjs: ', this.pendingWordObjs)
    },
    submitWord() {
        this.pushToWordsToValidate();

        // to do - push all letters separately to their own index of wordsToValidate for adjacent check
        if (this.firstWord) {
          const bool = this.startingColCheck()
          if (!bool) {
            // to do: call function that rejects the word
            return this.rejectSubmission();
          }
        } else {
          // check if the word is connected to another word
          const connected = this.connectedCheck();
          if (!connected) {
            console.log('word is not connected to another word')
            // to do: call function that rejects the word
            return this.rejectSubmission();
          }
        }

        // function only applies to single letter submissions in the first index of wordsToValidate (aka the primary submission)
        if (this.wordsToValidate[0].length == 1) {
          return this.handleSingleLetter();
        }

        this.findWordDirection();

        if (this.direction == 'horizontal') {
            this.horizontalWordHandler();
        } else if (this.direction == 'vertical') {
            this.verticalWordHandler();
        } else if (this.direction == null) {
            console.log('direction is not horizontal or vertical')
            // to do: call a function that rejects the word
            return this.rejectSubmission();
        }
    },
    pushToWordsToValidate() {
        // push all letters as to wordsToValidate as an array
        this.wordsToValidate.push(this.pendingWordObjs)
        // push each letter into separate index of wordsToValidate. Used for perpendicular check.
        this.wordsToValidate[0].forEach(tile => this.wordsToValidate.push([tile]))
    },
    connectedCheck() {
        // only checking on the initial submission
        const word = this.wordsToValidate[0]

        for (let i = 0; i < word.length; i++) {

            const row = word[i].rowIndex
            const col = word[i].colIndex

            const beforeTile = this.validatedObjs.find(tile => tile.rowIndex == row && tile.colIndex == col - 1)
            const afterTile = this.validatedObjs.find(tile => tile.rowIndex == row && tile.colIndex == col + 1)
            const aboveTile = this.validatedObjs.find(tile => tile.rowIndex == row - 1 && tile.colIndex == col)
            const belowTile = this.validatedObjs.find(tile => tile.rowIndex == row + 1 && tile.colIndex == col)

            //console.log('connectedCheck says ', beforeTile, afterTile, aboveTile, belowTile)

            if (beforeTile || afterTile || aboveTile || belowTile) {
                console.log('connectedCheck says word is connected')
                return true;
            }
        }

        return false;
    },
    handlePerpendicularWords() {
        this.currIndex++
        const word = this.wordsToValidate[this.currIndex]

        if (this.perpendicularDirection == 'horizontal') {
            this.beforeColCheck();
            this.afterColCheck();

            // if still a single letter, remove from wordsToValidate
            if (word.length == 1) {
              this.wordsToValidate.splice(this.currIndex, 1)
              this.currIndex--
              return this.checkIfLastWord()
            } else {
              return this.validateWord();
            }

        } else if (this.perpendicularDirection == 'vertical') {
            this.beforeRowCheck();
            this.afterRowCheck();

            if (word.length == 1) {
              this.wordsToValidate.splice(this.currIndex, 1)
              this.currIndex--
              return this.checkIfLastWord()
            } else {
              return this.validateWord();
            }
        } else {
            console.log('perpendicularDirection is not horizontal or vertical')
            return this.rejectSubmission();
        }
    },
    handleSingleLetter() {
        const beforeOrAfter = this.singleLetterHorizontalCheck();
        const aboveOrBelow = this.singleLetterVerticalCheck();

        // if single letter submission adjacent to words in both directions
        if (beforeOrAfter) {
            console.log('there is a tile before or after the word')
            this.direction = 'horizontal'
            this.perpendicularDirection = 'vertical'
            this.beforeColCheck();
            this.afterColCheck();
        } else
        if (aboveOrBelow) {
            this.direction = 'vertical'
            this.perpendicularDirection = 'horizontal'
            console.log('there is a tile above or below the word')
            this.beforeRowCheck();
            this.afterRowCheck();
        } else {
            console.log('there is no tile before or after the word')
            // to do: reject the word
            return this.rejectSubmission();
        }
        this.validateWord();
    },
    singleLetterHorizontalCheck() {
        const word = this.wordsToValidate[this.currIndex]
        const firstTile = word[0]
        const row = firstTile.rowIndex
        const col = firstTile.colIndex

        const beforeTile = this.validatedObjs.find(tile => tile.rowIndex == row && tile.colIndex == col - 1)
        const afterTile = this.validatedObjs.find(tile => tile.rowIndex == row && tile.colIndex == col + 1)

        if (beforeTile || afterTile) {
            return true;
        }
    },
    singleLetterVerticalCheck() {
        const word = this.wordsToValidate[this.currIndex]
        const firstTile = word[0]
        const row = firstTile.rowIndex
        const col = firstTile.colIndex

        const aboveTile = this.validatedObjs.find(tile => tile.rowIndex == row - 1 && tile.colIndex == col)
        const belowTile = this.validatedObjs.find(tile => tile.rowIndex == row + 1 && tile.colIndex == col)

        if (aboveTile || belowTile) {
            return true;
        }
    },
    horizontalWordHandler() {
        this.sortLetters();
        const colGaps = this.checkHorizontalGaps();
        if (colGaps.length > 0) {
            const bool = this.fillColGaps(colGaps)
            if (!bool) {
                // to do: call function that rejects the word
                return this.rejectSubmission();
            }
        }
        this.beforeColCheck();
        this.afterColCheck();
        this.validateWord();
    },
    verticalWordHandler() {
        this.sortLetters();
        const rowGaps = this.checkVerticalGaps();
        if (rowGaps.length > 0) {
            const bool = this.fillRowGaps(rowGaps)
            if (!bool) {
                console.log('verticalWordHandler is ending submission because there is not tile to fill gap')
                // to do: call function that rejects the word
                return this.rejectSubmission();
            }
        }
        this.beforeRowCheck();
        this.afterRowCheck();
        this.validateWord();
    },
    startingColCheck() {
      //check to ensure that one of the tiles is placed at row index 5, col index 0
      const firstColTile = this.wordsToValidate[0].find(tile => tile.colIndex == 0);

      if (firstColTile) {
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
          this.perpendicularDirection = 'vertical'
          //this.sortLetters(wordDirection)
      } else
      if (matchingColIndeces == this.wordsToValidate[this.currIndex].length) {
          this.direction = 'vertical'
          this.perpendicularDirection = 'horizontal'
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
    },
    checkVerticalGaps() {
        const wordArray = this.wordsToValidate[this.currIndex]

        const startingRow = wordArray[0].rowIndex
        const finalRow = wordArray[wordArray.length - 1].rowIndex
        const length = finalRow - startingRow

        const gapRows = []

        for (let i = 0; i < length; i++) {
            const tile = wordArray.find(tile => tile.rowIndex == startingRow + i)
            if (tile == null) {
                gapRows.push(startingRow + i)
            }
        }

        return gapRows;
    },
    fillColGaps(gapsArray) {
        const wordArray = this.wordsToValidate[this.currIndex]
        const startingCol = wordArray[0].colIndex
        const row = wordArray[0].rowIndex

        for (let i = 0; i < gapsArray.length; i++) {
            let gapFiller = this.validatedObjs.find(tile => tile.colIndex == gapsArray[i] && tile.rowIndex == row)

            if (gapFiller == null) {
                console.log('there is no tile to fill gap at col index: ', gapsArray[i])
                return false
            }

            // add gapFiller to this.wordsToValidate[this.currIndex] at index + 1
            this.wordsToValidate[this.currIndex].splice(gapsArray[i] - startingCol, 0, gapFiller)
        }
        return true;
    },
    fillRowGaps(gapsArray) {
        const wordArray = this.wordsToValidate[this.currIndex]

        const startingRow = wordArray[0].rowIndex
        const col = wordArray[0].colIndex

        for (let i = 0; i < gapsArray.length; i++) {
            let gapFiller = this.validatedObjs.find(tile => tile.rowIndex == gapsArray[i] && tile.colIndex == col)

            if (gapFiller == null) {
                console.log('there is no tile to fill gap at row index: ', gapsArray[i])
                return false
            }

            // add gapFiller to this.wordsToValidate[this.currIndex] at index + 1
            this.wordsToValidate[this.currIndex].splice(gapsArray[i] - startingRow, 0, gapFiller)
        }
        return true;
    },
    beforeColCheck() {
        const wordArray = this.wordsToValidate[this.currIndex]
        const firstCol = wordArray[0].colIndex

        const beforeTile = this.validatedObjs.find(tile => tile.rowIndex == wordArray[0].rowIndex && tile.colIndex == firstCol - 1)
        if (beforeTile) {
            this.wordsToValidate[this.currIndex].unshift(beforeTile)
            return this.beforeColCheck();
        }
    },
    beforeRowCheck() {
        const wordArray = this.wordsToValidate[this.currIndex]
        const firstRow = wordArray[0].rowIndex

        const beforeTile = this.validatedObjs.find(tile => tile.colIndex == wordArray[0].colIndex && tile.rowIndex == firstRow - 1)
        if(beforeTile) {
            this.wordsToValidate[this.currIndex].unshift(beforeTile)
            return this.beforeRowCheck();
        }
    },
    afterColCheck() {
        const wordArray = this.wordsToValidate[this.currIndex]
        const lastCol = wordArray[wordArray.length - 1].colIndex

        const afterTile = this.validatedObjs.find(tile => tile.rowIndex == wordArray[0].rowIndex && tile.colIndex == lastCol + 1)
        if (afterTile) {
            this.wordsToValidate[this.currIndex].push(afterTile)
            return this.afterColCheck();
        }
    },
    afterRowCheck() {
        const wordArray = this.wordsToValidate[this.currIndex]
        const lastRow = wordArray[wordArray.length - 1].rowIndex

        const afterTile = this.validatedObjs.find(tile => tile.colIndex == wordArray[0].colIndex && tile.rowIndex == lastRow + 1)
        if (afterTile) {
            this.wordsToValidate[this.currIndex].push(afterTile)
            return this.afterRowCheck();
        }
    },
    validateWord() {
        const currentWord = this.wordsToValidate[this.currIndex].map(tile => tile.letter).join('').toLocaleLowerCase();

        if (this.validWords.has(currentWord)) {
            console.log('Valid word: ', currentWord);
            if (this.firstWord) {
              this.firstWord = false
            }
        } else {
            console.log('Invalid word: ', currentWord);
            // to do: call function that rejects the word
            return this.rejectSubmission();
        }
        this.checkIfLastWord(currentWord);
    },
    checkIfLastWord(currentWord) {
        // check if all words have been validated
        if (this.currIndex == this.wordsToValidate.length - 1) {
            this.$emit('word-validated', currentWord);
            console.log('all words have been validated')
            return this.clearWords();
        } else {
            console.log('there are still words to validate. wordsToValidate: ', this.wordsToValidate)
            return this.handlePerpendicularWords();
        }
    },
    rejectSubmission() {
        console.log('word has been rejected', this.wordsToValidate)
        // to do: emit event for other components to handle word rejection
        // probably want to send pendingWordObjs to tile rack and clear grid cells
        this.clearWords();
    },
    clearWords() {
        this.currIndex = 0
        this.pendingWordObjs.forEach(tile => this.validatedObjs.push(tile))
        this.pendingWordObjs = []
        this.wordsToValidate = []
        this.direction = null
        this.perpendicularDirection = null
        this.gameOverCheck();
    },
    gameOverCheck() {
        //there are currntly 20 columns
        const lastCol = 19
        console.log('lastCol: ', lastCol)
        this.validatedObjs.forEach(tile => {
            if (tile.colIndex == lastCol) {
                console.log('game is over')
                //emit event to stop timer
                this.$emit('game-over')
                // to do: call function that ends the game
                return true;
            }
        })
    }
  }
}
</script>
