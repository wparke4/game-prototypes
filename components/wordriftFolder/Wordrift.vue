<template>
    <div
        class="flex flex-col items-center justify-center space-y-3 h-screen"
    >
        <Grid @tile-placed="tilePlacedOnGrid"  />
        <TileRack ref="tileRack" />
        <WordValidator ref="wordValidator"/>
        <button
            @click="$refs.wordValidator.submitWord()"
            class=" hover:bg-blue-100 py-2 px-4 rounded border border-gray-300"
        >
            Submit Word
        </button>
    </div>
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
        tilePlacedOnGrid(tileData, rowIndex, colIndex) {
            console.log('wordrift says tileData: ', tileData)
            this.$refs.tileRack.removeTile(tileData.id);
            this.$refs.wordValidator.addTile(tileData.letter, rowIndex, colIndex);
        }
    }
}
</script>
<style scoped>
/* your CSS here */
</style>
