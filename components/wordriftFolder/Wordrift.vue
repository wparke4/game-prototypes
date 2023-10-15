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
            grid: this.createGrid(10,20)
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
  height: 40px;
  width: 40px;
  border: 1px solid #ddd;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
}

.grid-cell:hover {
  background-color: #eee;
}
</style>

