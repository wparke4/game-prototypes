<template>
    <div class="flex flex-row justify-center pt-24 text-4xl">
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
                :class="{ 'bg-gray-700': cell.isHazard, 'bg-green-500': cell.isOccupied, 'bg-green-300': cell.isPath, 'bg-red-800': cell.isMovingHazard }"
                :key="'cell-' + rowIndex + '-' + colIndex"
            >

            </div>
        </div>
        <div class="flex flex-col justify-center pt-12 text-xl">
            <button @click="resetPlayer()" class="btn">
                <p>Reset Player</p>
                <p class="text-sm">(spacebar)</p>
            </button>
        </div>
    </div>
</template>

<script setup>

let grid = ref([])

let rows = 8;
let cols = 8;
let movingHazardRow = 4
let movingHazardCol = 1
let movingHazardDirection
let hazardsToCreate = 1
let levelCount = 1
let numberOfHazards = 0
let pathCount = 0
let hazardIsMoving = true
let firstMovingHazardCheck = true

const createGrid = () => {
    for (let i = 0; i < rows; i++) {
        let currRow = []
        //create array of cols for this row
        for (let j = 0; j < cols; j++) {
            currRow.push({row: i, col: j, isHazard: false, isOccupied: false, isPath: false, isMovingHazard: false})
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

const createMovingHazard = () => {
    // randomly choose row
    // randomly choose direction
    const directions = ["up", "down", "left", "right"]
    const randomInt = Math.floor(Math.random() * directions.length)
    movingHazardDirection = directions[randomInt]

    const row = 1
    const col = 1
    grid.value[row][col].isMovingHazard = true

    setTimeout(movingHazardManager, 1000)
}

const movingHazardManager = () => {

    if (!hazardIsMoving) { return }

    const newCell = determineNextHazardCell()

    if ((newCell.row || newCell.col) < 0 || newCell.row > rows - 1 || newCell.col > cols - 1) {
        firstMovingHazardCheck = false
        changeMovingHazardDirection()
        movingHazardManager()
    }

    // check if able to move to new cell
    const cellMoveable = checkHazardMove(newCell)

    if (cellMoveable === "death") {
        // call function that triggers death and resets the level
        return
    } else
    if (cellMoveable) {
        moveHazard(newCell)
    } else
    if (!cellMoveable && !firstMovingHazardCheck) {
        hazardIsMoving = false
        return
    } else
    if (!cellMoveable) {
        firstMovingHazardCheck = false
        changeMovingHazardDirection()
        return movingHazardManager()
    }
}

const determineNextHazardCell = () => {
    const currRow = movingHazard.value.row
    const currCol = movingHazard.value.col

    let newRow
    let newCol

    // find next cell in the direction of movement
    if ( movingHazardDirection === "up" ) {
        newRow = currRow - 1
        newCol = currCol
    } else
    if ( movingHazardDirection === "down" ) {
        newRow = currRow + 1
        newCol = currCol
    } else
    if ( movingHazardDirection === "left" ) {
        newRow = currRow
        newCol = currCol - 1
    } else
    if ( movingHazardDirection === "right" ) {
        newRow = currRow
        newCol = currCol + 1
    }

    if ( newRow < 0 || newCol < 0 ) {
        changeMovingHazardDirection()
        return determineNextHazardCell()
    }

    return { row: newRow, col: newCol }
}

const checkHazardMove = (cellData) => {
    const cell = grid.value[cellData.row][cellData.col]

    if ( cell.isOccupied ) {
        return "death"
    } else
    if ( cell.isPath || cell.isHazard || !cell) {
        return false
    } else {
        return true
    }
}

const changeMovingHazardDirection = () => {
    if ( movingHazardDirection === "up" ) {
        return movingHazardDirection = "down"
    }
    if (movingHazardDirection === "down" ) {
        return movingHazardDirection = "up"
    }
    if ( movingHazardDirection === "left" ) {
        return movingHazardDirection = "right"
    }
    if (movingHazardDirection === "right" ) {
        return movingHazardDirection = "left"
    }

}

const moveHazard = (newCellData) => {
    const currRow = movingHazard.value.row
    const currCol = movingHazard.value.col

    const oldCell = grid.value[currRow][currCol]
    oldCell.isMovingHazard = false

    const newCell = grid.value[newCellData.row][newCellData.col]

    newCell.isMovingHazard = true

    firstMovingHazardCheck = true

    setTimeout(movingHazardManager, 1000)
}

const restartMovingHazard = () => {
    firstMovingHazardCheck = true
    if (!hazardIsMoving) {
        hazardIsMoving = true
        setTimeout(movingHazardManager, 1000)
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
    if ( (row === 0 && col === 0) || (row === 1 && col === 1)) {
        return true
    }
}

const checkExistingHazard = (indexes) => {
    const row = indexes.arrayIndex
    const col = indexes.colIndex

    const cellToCheck = grid.value[row][col]

    if ( cellToCheck.isHazard === true) {
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
    case ' ':
      resetPlayer()
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
    const holesToFill = gridSize - (numberOfHazards + 1)
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

const movingHazard = computed(() => {
    for (let i = 0; i < grid.value.length; i++) {
        const movingHazard = grid.value[i].find(element => element.isMovingHazard)
        if (movingHazard) { return movingHazard}
    }
})

const resetPlayer = () => {
    const currRow = occupiedCell.value.row
    const currCol = occupiedCell.value.col

    const oldCell = grid.value[currRow][currCol]
    oldCell.isOccupied = false

    // reset all path cells
    for (let i = 0; i < grid.value.length; i++) {
        for (let j = 0; j < grid.value[i].length; j++) {
            grid.value[i][j].isPath = false
        }
    }

    grid.value[0][0].isOccupied = true
    pathCount = 0

    restartMovingHazard()
}

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
    createMovingHazard()
    firstMovingHazardCheck = true
    hazardIsMoving = true
    createPlayer()
}


onMounted(() => {
   window.addEventListener('keydown', handleKeydown)
   createGrid()
   createHazards()
   createMovingHazard()
   createPlayer()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
