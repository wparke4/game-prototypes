<template>
    <div class="flex items-center justify-center w-full">
        <div
            v-if="waitingToStart"
            v-for="(player, index) in players"
            class="flex flex-col justify-center items-center space-y-1 text-center md:w-20 transition ease-in-out rounded-full w-10 h-10"
            id="player.id"
            :class="{ currentPlayer: player.isCurrentPlayer }"
        >
            <div
                class="font-medium text-xs sm:text-sm md:text-sm w-12 sm:w-auto overflow-hidden text-ellipsis"
            >
                {{ player.username }}
            </div>
        </div>
    </div>
</template>




<script setup>

const supabase = useSupabaseClient();
let user = useSupabaseUser();
const players = useState("players")
const waitingToStart = useState("waitingToStart");
const game = useState("game");

</script>
<style scoped>
.currentPlayer {
    background-color: rgb(98, 241, 98);
}
</style>
