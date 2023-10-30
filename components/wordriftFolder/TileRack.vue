<template>
  <div class="tile-rack"
      @dragover.prevent
  >
    <div
      v-for="tile in rackLetters"
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
          { letter: 'A', count: 9 },
          { letter: 'B', count: 2 },
          { letter: 'C', count: 2 },
          { letter: 'D', count: 4 },
          { letter: 'E', count: 12 },
          { letter: 'F', count: 2 },
          { letter: 'G', count: 3 },
          { letter: 'H', count: 2 },
          { letter: 'I', count: 9 },
          { letter: 'J', count: 1 },
          { letter: 'K', count: 1 },
          { letter: 'L', count: 4 },
          { letter: 'M', count: 2 },
          { letter: 'N', count: 6 },
          { letter: 'O', count: 8 },
          { letter: 'P', count: 2 },
          { letter: 'Q', count: 1 },
          { letter: 'R', count: 6 },
          { letter: 'S', count: 4 },
          { letter: 'T', count: 6 },
          { letter: 'U', count: 4 },
          { letter: 'V', count: 2 },
          { letter: 'W', count: 2 },
          { letter: 'X', count: 1 },
          { letter: 'Y', count: 2 },
          { letter: 'Z', count: 1 }
      ],
      tileBag: [],
      rackLetters: [],
      //availableLetters: ['A', 'A', 'B', 'C', 'D', 'E', 'E', 'E', 'F', 'G', 'H', 'I', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      nextAvailableID: 0,
      pendingTiles: [],
      validatedTiles: []
    };
  },
  methods: {
    createTileBag() {
        //create the tile bag.
        //call this on mounted then call replenish tiles
        this.tiles.forEach(tile => {
            for (let i = 0; i < tile.count; i++) {
                this.tileBag.push({ id: this.nextAvailableID, letter: tile.letter });
                this.nextAvailableID++;
            }
        })

    },
    startDrag(event, tile) {
      // Logic for handling drag start
      // e.g., sending the tile data to be received by a drop target
      event.dataTransfer.setData("tile", JSON.stringify(tile));
    },
    removeTile(tileId) {
      const tile = this.rackLetters.findIndex(tile => tile.id === tileId);
      if (tile > -1) {
        this.pendingTiles.push(this.tiles[tile]);
        this.rackLetters.splice(tile, 1);
      }
    },
    validateTiles() {
        this.pendingTiles.forEach(tile => this.validatedTiles.push(tile))
        this.pendingTiles = []

        this.replenishTiles();
    },
    replenishTiles() {
      while (this.rackLetters.length < 10 && this.tileBag.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.tileBag.length);
        const letter = this.tileBag.splice(randomIndex, 1)[0];
        //this.rackLetters.push({ id: this.nextAvailableID, letter });
        this.rackLetters.push(letter)
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
        this.rackLetters.push(tileData)
        tileData.typeCell = false;
        this.$emit('tile-placed-on-rack', tileData)
    }
  },
  mounted() {
      this.createTileBag();
      this.replenishTiles();
    },
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
