<template>
    <div
        class="flex flex-col items-center justify-center space-y-3 h-screen"
        @dragover.prevent
    >
        <UpTimer
            ref="upTimer"
        />
        <Grid
            ref="grid"
            @tile-placed="tilePlacedOnGrid"
            @remove-tile="removeTileFromGrid"
        />
        <TileRack
            ref="tileRack"
            @tile-placed-on-rack="tilePlacedOnRack"
        />
        <WordValidator
            ref="wordValidator"
            @word-validated="wordValidated"
            @game-over="gameOver"
        />
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
import UpTimer from "@/components/wordriftFolder/UpTimer.vue";

export default {
    components: {
        TileRack,
        Grid,
        WordValidator,
        UpTimer
    },
    methods: {
        tilePlacedOnGrid(tileData, rowIndex, colIndex) {
            console.log('wordrift says tileData: ', tileData)
            if (!tileData.typeCell) {
                this.$refs.tileRack.removeTile(tileData.id);
            }
            this.$refs.wordValidator.addTile(tileData.letter, rowIndex, colIndex);
            this.$refs.upTimer.startTimer();
        },
        removeTileFromGrid(rowIndex, colIndex) {
            this.$refs.wordValidator.removeTile(rowIndex, colIndex);
        },
        wordValidated() {
            this.$refs.grid.wordValidated();
            this.$refs.tileRack.validateTiles();
            //this.$refs.wordValidator.resetWordValidator();
        },
        tilePlacedOnRack(tileData) {
            const rowIndex = tileData.rowIndex;
            const colIndex = tileData.colIndex;

            this.$refs.wordValidator.removeTile(rowIndex, colIndex);
            this.$refs.grid.clearCell(tileData);
        },
        gameOver() {
            this.$refs.upTimer.stopTimer();
        }
    }
}
</script>
<style scoped>
/* your CSS here */
</style>
