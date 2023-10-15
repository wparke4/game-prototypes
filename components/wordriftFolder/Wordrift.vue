<template>
    <Grid @tile-placed="tilePlacedOnGrid"  />
    <TileRack ref="tileRack" />
</template>

<script>
import TileRack from "@/components/wordriftFolder/TileRack.vue";
import Grid from "@/components/wordriftFolder/Grid.vue";

export default {
    components: {
        TileRack,
        Grid
    },
    methods: {
        tilePlacedOnGrid(tileData) {
            console.log('wordrift says tileData: ', tileData)
            this.$refs.tileRack.removeTile(tileData);
        }
    }
}
</script>
<style scoped>
/* your CSS here */
</style>
