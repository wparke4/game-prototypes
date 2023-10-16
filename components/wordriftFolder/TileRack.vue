<template>
  <div class="tile-rack">
    <div
      v-for="tile in tiles"
      :key="tile.id"
      class="tile"
      @dragstart="event => startDrag(event, tile)"
      draggable="true"
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
        { rackIndex: 0, letter: 'A' },
        { rackIndex: 2, letter: 'Y' },
        { rackIndex: 3, letter: 'P' },
        { rackIndex: 4, letter: 'G' },
        { rackIndex: 5, letter: 'I' },
        { rackIndex: 6, letter: 'S' },
        { rackIndex: 7, letter: 'F' }
        // Add initial tiles here or fetch them from an API/parent component
      ],
      availableLetters: ['A', 'A', 'B', 'C', 'D', 'E', 'E', 'E', 'F', 'G', 'H', 'I', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      nextAvailableID: 8,
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
    }
    /*
    replenishTiles() {
      while (this.tiles.length < 7 && this.availableLetters.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.availableLetters.length);
        const letter = this.availableLetters.splice(randomIndex, 1)[0];
        this.tiles.push({ id: this.nextAvailableID, letter });
        this.nextAvailableID++;
    }
    }
    */
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
