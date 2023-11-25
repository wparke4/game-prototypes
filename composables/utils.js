import { useState } from "nuxt/app";

export const utils = () => {
    const game = useState("game");

    const gameStatus = computed(() => {
        return game.value?.gameStatus;
    })

    const players = computed(() => {
        if (!game.value.players.length === players.length)
            fetchUsernames()
            return game.value?.players;
    })
    const fetchUsernames = async () => {
        for (let i = 0; i < game.value.players.length; i++) {
            const currentId = game.value.players[i]
            const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', currentId)

            if (error) {
                console.error('Error fetching usernames:', error);
                return;
            }

            console.log("player data.username ", data[0].username)
            players.value.push( { username: data[0].username, id: game.value.players[i] } )
            console.log("players array: ", players.value)
        }
    }
    return {
      gameStatus,
      players,
    };
  };
