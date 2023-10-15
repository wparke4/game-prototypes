<template>
  <div class="game-board">
      <div
          v-for="row in grid"
          :key="row.id"
          class="grid-row"
      >
          <div
              v-for="cell in row.cells"
              :key="cell.id"
              class="grid-cell"
              @dragover.prevent
              @drop="event => handleDrop(event, cell)"
              @click="cellClickHandler(cell)"
          >
              {{  cell.letter }}
          </div>
      </div>
  </div>
</template>

<script>

export default {
  data() {
      return {
          grid: this.createGrid(11,30)
      }
  },
  methods: {
      createGrid(rows, cols) {
          //Create a psuedo array of rows
          return Array.from({ length: rows }, (_, rowIndex) => ({
              id: rowIndex,
              /* Create an array of length cols for each row
              Map over each element in the array and create and object
              with an id of row index and col index as well as letter parameter */
              cells: Array.from({ length: cols }, (_, colIndex) => ({
                  id: `${rowIndex}-${colIndex}`,
                  letter: null
              }))
          }))
      },
      cellClickHandler(cell) {
          console.log('Cell clicked: ', cell);
          /*
          To Do: implement logic for clicking cell
          I would only want to do something if the cell has a letter.
          The action would be to pop that letter back into player's hand
          if the word has not been submitted and validated yet.
          */
      },
      handleDrop(event, cell) {
          // retrieve tile data from the event
          const tileData = JSON.parse(event.dataTransfer.getData("tile"));

          // logic to place tile on the grid
          this.placeTileOnGrid(tileData, cell);
      },
      placeTileOnGrid(tileData, cell) {
          // find the row and col index of the cell
          const [rowIndex, colIndex] = cell.id.split("-");

          // check if the cell is empty then places the tile
          if (!this.grid[rowIndex].cells[colIndex].letter) {
              this.grid[rowIndex].cells[colIndex].letter = tileData.letter;

              // Communicate back to tile rack to remove this tile from there
              this.$emit('tile-placed', tileData, rowIndex, colIndex);
          } else {
              console.log('Cell is already occupied');
          }
      },
      isValidWord(word) {
        return this.validWords.has(word.toLowerCase());
      },
      submitWord(word) {
        if (this.isValidWord(word)) {
          console.log('Valid word: ', word);
        } else {
          console.log('Invalid word: ', word);
        }
      }
  }
}
</script>

<style scoped>
.game-board {
display: flex;
flex-direction: column;
}

.grid-row {
display: flex;
}

.grid-cell {
height: 50px;
width: 50px;
border: 1px solid #ddd;
text-align: center;
line-height: 50px;
cursor: pointer;
}

.grid-cell:hover {
background-color: #eee;
}
</style>

