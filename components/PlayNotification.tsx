import { createAudioPlayer, AudioPlayer } from "expo-audio";

let player: AudioPlayer | null = null;

export async function initSound() {
  player = createAudioPlayer(
    require("@/assets/sound/notification.wav")
  );
}

export async function playSound() {
  try {
    if (!player) {
      await initSound();
    }

    player?.seekTo(0);
    player?.play();

  } catch (error) {
    console.log("Sound error:", error);
  }
}