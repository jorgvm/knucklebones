import type { Sound } from "~/types/sound";

export const playSound = (soundName: Sound, volume = 1): void => {
  const audio = new Audio(`/sfx/${soundName}.mp3`);
  audio.volume = volume;
  audio.play().catch((e) => {
    console.warn(`Could not play sound ${soundName}:`, e);
  });
};
