<template>
    <Grid @tile-placed="tilePlacedOnGrid"  />
    <TileRack ref="tileRack" />
    <WordValidator ref="wordValidator"/>
</template>

<script>
import TileRack from "@/components/wordriftFolder/TileRack.vue";
import Grid from "@/components/wordriftFolder/Grid.vue";
import WordValidator from "@/components/wordriftFolder/WordValidator.vue";

export default {
    components: {
        TileRack,
        Grid,
        WordValidator
    },
    methods: {
        tilePlacedOnGrid(tileData) {
            console.log('wordrift says tileData: ', tileData)
            this.$refs.tileRack.removeTile(tileData.id);
            this.$refs.wordValidator.addTile(tileData.letter);
        }
    }
}
</script>
<style scoped>
/* your CSS here */
</style>
