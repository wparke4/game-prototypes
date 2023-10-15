<template>
  <div class="grid">
    <div
      v-for="(row, rowIndex) in grid"
      :key="`row-${rowIndex}`"
      class="grid-row"
    >
      <CellComponent
        v-for="(cell, cellIndex) in row"
        :key="`cell-${cellIndex}`"
        :cellData="cell"
      />
    </div>
  </div>
</template>

<script>
import CellComponent from '~/components/CellComponent'

export default {
  components: {
    CellComponent
  },
  data() {
    return {
      grid: Array(11).fill(Array(25).fill({ letter: null, isActive: false }))
    }
  }
}
</script>

<style scoped>
.grid {
  display: flex;
  flex-direction: column;
}
.grid-row {
  display: grid;
  grid-template-columns: repeat(25, 1fr);
  grid-gap: 0px;
}
</style>
