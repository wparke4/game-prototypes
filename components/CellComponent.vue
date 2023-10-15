<template>
  <div
    class="tile border border-gray-500 rounded-s h-14 w-14 hover:bg-indigo-200 cursor-pointer"
    :class="{ 'is-dragging': isDragging }"
    @dragstart="startDrag"
    @dragend="endDrag"
    draggable
  >
    {{ letter }}
  </div>
</template>

<script>
export default {
  props: ['letter'],
  data() {
    return {
      isDragging: false
    }
  },
  methods: {
    startDrag() {
      this.isDragging = true;
    },
    endDrag() {
      this.isDragging = false;
    }
  }
}
</script>

<style scoped>
.tile {
  /* Your styling for the tile */
  background-color: rgb(255, 255, 255);
}
.tile.is-dragging {
  /* Styling while tile is being dragged */
  background-color: rgb(208, 208, 251);
}
</style>
