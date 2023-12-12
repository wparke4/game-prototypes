<template>
    <div class="flex flex-row justify-center pt-24 text-2xl">
        Level {{ levelCount }}
    </div>
    <div class="flex flex-col justify-center h-screen items-center">
        <div
            v-for="(row, rowIndex) in grid"
            class="flex col"
        >
            <div
                v-for="(cell, colIndex) in row"
                class="flex w-12 h-12 border-gray-500 border rounded-md"
                :class="{ 'bg-gray-700': cell.isHazard, 'bg-green-500': cell.isOccupied, 'bg-green-300': cell.isPath }"
                :key="'cell-' + rowIndex + '-' + colIndex"
            >

            </div>
        </div>
    </div>
</template>

<script setup>

let grid = ref([])

let rows = 8;
let cols = 8;
let hazardsToCreate = 1
let levelCount = 1
let numberOfHazards = 0
let pathCount = 0

const createGrid = () => {
    for (let i = 0; i < rows; i++) {
        let currRow = []
        //create array of cols for this row
        for (let j = 0; j < cols; j++) {
            currRow.push({row: i, col: j, isHazard: false, isOccupied: false, isPath: false})
        }
        grid.value.push(currRow)
    }
}

const createHazards = () => {
    while (numberOfHazards < hazardsToCreate) {
        const indexes = generateRandomIndexes()

        const improperPlacement = checkImproperPlacement(indexes)
        if ( improperPlacement === true) {
            continue
        }

        const existingHazard = checkExistingHazard(indexes)
        if (existingHazard === false) {
            placeHazard(indexes)
        }
    }
}

const generateRandomIndexes = () => {
    const arrayIndex = Math.floor(Math.random() * rows)
    const colIndex = Math.floor(Math.random() * cols)

    return { arrayIndex: arrayIndex, colIndex: colIndex }
}

const checkImproperPlacement = (indexes) => {
    const row = indexes.arrayIndex
    const col = indexes.colIndex

    // check if located in starting position
    if ( row === 0 && col === 0 ) {
        console.log("cannot place hazard in cell 0")
        return true
    }
}

const checkExistingHazard = (indexes) => {
    const row = indexes.arrayIndex
    const col = indexes.colIndex

    const cellToCheck = grid.value[row][col]

    if ( cellToCheck.isHazard === true) {
        console.log("hazard already exists here")
        return true
    } else {
        return false
    }
}

const placeHazard = (indexes) => {
    const row = indexes.arrayIndex
    const col = indexes.colIndex
    grid.value[row][col].isHazard = true
    numberOfHazards++
}

const createPlayer = () => {
    grid.value[0][0].isOccupied = true
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

    const isPath = pathCheck(cellToCheck)
    if (isPath === true) {
        return
    }

    const isHazard = hazardCheck(cellToCheck)
    if (isHazard === true) {
        //call function that resets the level
        console.log("you fell in a hole and died")
    } else if (isHazard === false) {
        updateOccupiedCell(cellToCheck)
        checkLevelComplete()
    }
}

const calculateNewCell = (rowDelta, colDelta) => {
    const startingRow = occupiedCell.value.row
    const startingCol = occupiedCell.value.col

    const newRow = startingRow + rowDelta
    const newCol = startingCol + colDelta

    if (newRow < 0 || newRow > rows - 1 || newCol < 0 || newCol > cols - 1) {
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

const pathCheck = (cellToCheck) => {
    if (cellToCheck.isPath === true) {
        // call function that fails level and resets
        return true
    } else if (cellToCheck.isPath === false) {
        return false
    }
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
        if (occupied) {
            occupied.isOccupied = false
            occupied.isPath = true
            pathCount++
        }
    }

    newCell.isOccupied = true
}

const checkLevelComplete = () => {
    const gridSize = rows * cols
    const holesToFill = gridSize - numberOfHazards
    if (pathCount === holesToFill - 1) {
        console.log("level complete")
        setTimeout(newLevel, 1000);
    }
}

const occupiedCell = computed(() => {
    for (let i = 0; i < grid.value.length; i++) {
        const occupied = grid.value[i].find(element => element.isOccupied)
        if (occupied) { return occupied}
    }
})

const newLevel = () => {
    grid.value = []
    rows++
    cols++
    createGrid()
    hazardsToCreate++
    numberOfHazards = 0
    pathCount = 0
    levelCount++
    createHazards()
    createPlayer()
}


onMounted(() => {
   window.addEventListener('keydown', handleKeydown)
   createGrid()
   createHazards()
   createPlayer()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
