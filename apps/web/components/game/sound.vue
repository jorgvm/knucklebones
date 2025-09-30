<script lang="ts" setup>
  import { inject } from "vue";
  import type { GameData } from "@shared/types";
  import { COOKIE_PLAYER_ID } from "@shared/utilities/constants";
  import { randomIntBetween } from "@shared/utilities/random-int-between";
  type Sound =
    | "start-game-1"
    | "lost-1"
    | "won-1"
    | "won-2"
    | "place-1"
    | "place-2"
    | "place-3"
    | "place-4"
    | "place-5"
    | "place-6"
    | "place-7"
    | "destroy-1";

  const cookiePlayerId = useCookie(COOKIE_PLAYER_ID);

  const gameData = inject<Ref<GameData>>("gameData");
  if (!gameData?.value) {
    throw new Error("GameData was not provided");
  }

  const isTie = computed(() => gameData.value.winner.length > 1);

  const nowPlayingName = computed(() => {
    const playerId = gameData.value.active_player;
    return gameData.value.players.find((p) => p.id === playerId)?.name;
  });

  const localPlayerTurn = computed(() => {
    return gameData.value.active_player === cookiePlayerId.value;
  });

  const gameWon = computed(() => {
    return gameData.value.winner.includes(cookiePlayerId.value || "");
  });

  const gameLost = computed(() => {
    return !gameData.value.winner.includes(cookiePlayerId.value || "");
  });

  // Function to play the sound
  const playSound = (soundName: Sound, volume = 1) => {
    const audio = new Audio(`/sfx/${soundName}.mp3`);
    audio.volume = volume;
    audio.play();
  };

  // Watch for a winner or a tie
  watch([gameData], ([newGameData]) => {
    if (newGameData.latest_actions.includes("die_placed")) {
      playSound(("place-" + randomIntBetween(1, 4)) as Sound);
    }

    if (newGameData.latest_actions.includes("game_created")) {
      playSound("start-game-1", 0.2);
    }

    if (newGameData.latest_actions.includes("game_finished") && gameWon.value) {
      console.log("gamewon");
      playSound("won-2", 0.6);
    }

    if (
      newGameData.latest_actions.includes("game_finished") &&
      gameLost.value
    ) {
      console.log("gamelost");
      playSound("lost-1", 0.3);
    }

    if (newGameData.latest_actions.includes("die_removed")) {
      playSound("destroy-1");
    }
  });
</script>
