import * as audio from "tone";
import { Tone } from "./tone";

export async function playTone(tone: Tone, opts?: Parameters<audio.Synth["triggerAttackRelease"]>) {
  return new Promise<void>(async (resolve) => {
    await audio.start();
    const synth = new audio.Synth().toDestination();
    synth.triggerAttackRelease(tone, "8n").onsilence = () => {
      resolve();
    };
  });
}
