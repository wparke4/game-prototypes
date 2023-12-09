<template>
    <div>
        <div v-for="(row, rowIndex) in grid" class="flex co">
            <div
                v-for="(cell, colIndex) in row"
                class="flex w-20 h-20 border-gray-500 border rounded-xs"
                :class="{ 'bg-black': cell.isHazard }"
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
    console.log("create grid called")
    for (let i = 0; i < rows; i++) {
        let currRow = []
        //create array of cols for this row
        for (let j = 0; j < cols; j++) {
            currRow.push({row: i, col: j, isHazard: false, isOccupied: false})
        }
        grid.value.push(currRow)
    }
    console.log(grid)
}

const createRandomHazards = () => {
    grid.value[0][0].isHazard = true
    console.log("create rand..", grid.value[0][0])
}

console.log("what the fuck")
onMounted(() => {
   createGrid(),
   createRandomHazards()
});
</script>
