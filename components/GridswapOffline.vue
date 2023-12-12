<template>
    <div>
        <div
            v-for="(row, rowIndex) in grid"
            class="flex col"
        >
            <div
                v-for="(cell, colIndex) in row"
                class="flex w-20 h-20 border-gray-500 border rounded-xs"
                :class="{ 'bg-black': cell.isHazard, 'bg-green-400': cell.isOccupied}"
                :key="'cell-' + rowIndex + '-' + colIndex"
            >
                {{ rowIndex }}, {{ colIndex }}
            </div>
        </div>
    </div>
</template>

<script setup>

let grid = ref([])

const rows = 5;
const cols = 5;

const createGrid = () => {
    for (let i = 0; i < rows; i++) {
        let currRow = []
        //create array of cols for this row
        for (let j = 0; j < cols; j++) {
            currRow.push({row: i, col: j, isHazard: false, isOccupied: false})
        }
        grid.value.push(currRow)
    }
}

const createRandomHazards = () => {
    grid.value[0][0].isHazard = true
}

const createPlayer = () => {
    grid.value[0][1].isOccupied = true
}

const handleKeydown = (event) => {
  switch(event.key) {
    case 'ArrowUp':
      // handle up arrow key
      handleMove(-1,0)
      break;
    case 'ArrowDown':
      // handle down arrow key
      handleMove(1, 0)
      break;
    case 'ArrowLeft':
      // handle left arrow key
      handleMove(0, -1)
      break;
    case 'ArrowRight':
      // handle right arrow key
      handleMove(0, 1)
      break;
  }
}

const handleMove = (rowDelta, colDelta) => {
    const cellToCheckData = calculateNewCell(rowDelta, colDelta)

    if (!cellToCheckData) {
        return
    }

    const cellToCheck = findNewCell(cellToCheckData)
    if (!cellToCheck) {
        console.log("no cell in that direction")
        return
    }

    const isHazard = hazardCheck(cellToCheck)
    if (isHazard === true) {
        //call function that resets the level
        console.log("you fell in a hole and died")
    } else if (isHazard === false) {
        updateOccupiedCell(cellToCheck)
    }
}

const calculateNewCell = (rowDelta, colDelta) => {
    const startingRow = occupiedCell.value.row
    const startingCol = occupiedCell.value.col

    const newRow = startingRow + rowDelta
    const newCol = startingCol + colDelta

    if (newRow < 0 || newRow > rows - 1 || newCol < 0 || newCol > cols - 1) {
        console.log("no cell in that direction exists")
        return
    }

    return { row: newRow, col: newCol }
}

const findNewCell = (newCellData) => {
    //const cellToCheck = grid.value[newCellData.row].col === newCellData.col
    const cellToCheck = grid.value[newCellData.row].find(element => element.col === newCellData.col)

    if (!cellToCheck) {
        return
    }

    return cellToCheck
}

const hazardCheck = (cellToCheck) => {
    if (cellToCheck.isHazard === true) {
        // call function that fails level and resets
        return true
    } else if (cellToCheck.isHazard === false) {
        return false
    }
}

const updateOccupiedCell = (newCell) => {
    for (let i = 0; i < grid.value.length; i++) {
        const occupied = grid.value[i].find(element => element.isOccupied)
        if (occupied) { occupied.isOccupied = false }
    }

    newCell.isOccupied = true
}

const occupiedCell = computed(() => {
    for (let i = 0; i < grid.value.length; i++) {
        const occupied = grid.value[i].find(element => element.isOccupied)
        if (occupied) { return occupied}
    }
})


onMounted(() => {
   window.addEventListener('keydown', handleKeydown)
   createGrid()
   createRandomHazards()
   createPlayer()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
