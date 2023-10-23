<template>
  <div class="tile-rack"
      @dragover.prevent
      @drop="event => handleDrop(event)"
  >
    <div
      v-for="tile in tiles"
      :key="tile.id"
      class="tile"
      @dragstart="event => startDrag(event, tile)"
      draggable="true"
      @dragover.prevent
      @drop="event => handleDrop(event)"
    >
      {{ tile.letter }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tiles: [
        { rackIndex: 1, letter: 'A' },
        { rackIndex: 2, letter: 'Y' },
        { rackIndex: 3, letter: 'P' },
        { rackIndex: 4, letter: 'G' },
        { rackIndex: 5, letter: 'I' },
        { rackIndex: 6, letter: 'S' },
        { rackIndex: 7, letter: 'E' },
        { rackIndex: 8, letter: 'R' },
        { rackIndex: 9, letter: 'S' },
        { rackIndex: 10, letter: 'M' },
        { rackIndex: 11, letter: 'A' },
        { rackIndex: 12, letter: 'N' }
        // Add initial tiles here or fetch them from an API/parent component
      ],
      availableLetters: ['A', 'A', 'B', 'C', 'D', 'E', 'E', 'E', 'F', 'G', 'H', 'I', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      nextAvailableID: 13,
      pendingTiles: [],
      validatedTiles: []
    };
  },
  methods: {
    startDrag(event, tile) {
      // Logic for handling drag start
      // e.g., sending the tile data to be received by a drop target
      event.dataTransfer.setData("tile", JSON.stringify(tile));
    },
    removeTile(tileId) {
      const tileIndex = this.tiles.findIndex(tile => tile.rackIndex === tileId);
      if (tileIndex > -1) {
        this.pendingTiles.push(this.tiles[tileIndex]);
        this.tiles.splice(tileIndex, 1);
      }
    },
    replenishTiles() {
      this.pendingTiles.forEach(tile => this.validatedTiles.push(tile))
      this.pendingTiles = []

      while (this.tiles.length < 11 && this.availableLetters.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.availableLetters.length);
        const letter = this.availableLetters.splice(randomIndex, 1)[0];
        this.tiles.push({ rackIndex: this.nextAvailableID, letter });
        this.nextAvailableID++;
     }
    },
    handleDrop(event) {
        const tileData = JSON.parse(event.dataTransfer.getData("tile"));
        if (tileData.typeCell) {
            return this.placeTileOnRack(tileData);
        }
    },
    placeTileOnRack(tileData) {
        console.log('tile has been droped in rack', tileData)
        this.tiles.push(tileData)
        tileData.typeCell = false;
        this.$emit('tile-placed-on-rack', tileData)
    }
  }
}
</script>

<style scoped>
.tile-rack {
  display: flex;
  /* Additional styling */
}
.tile {
  margin: 0.5rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: grab;
  /* Additional styling */
}
.tile:active {
  cursor: grabbing;
}
</style>
