<template>
    <div>
        <div v-for="row in grid" class="flex co">
            <div v-for="cell in row" class="flex w-20 h-20 border-gray-500 border-2 rounded-xs">
                {{ cell.row }}, {{ cell.col }}
            </div>
        </div>
    </div>
</template>

<script setup>

let grid = ref([])

const rows = 5;
const cols = 5;
/*
const createGrid = () => {
    grid = Array.from({ length: rows }, (_, rowIndex) =>
        Array.from({ length: cols }, (_, colIndex) => ({
            row: rowIndex,
            col: colIndex,
            isHole: false,
            isOccupied: false,
        }))
    );
    console.log(grid)
}
*/
const createGrid = () => {
    console.log("create grid called")
    for (let i = 0; i < rows; i++) {
        let currRow = []
        //create array of cols for this row
        for (let j = 0; j < cols; j++) {
            currRow.push({row: i, col: j})
        }
        grid.value.push(currRow)
    }
    console.log(grid)
}
console.log("what the fuck")
onMounted(() => {
   createGrid()
});
</script>
