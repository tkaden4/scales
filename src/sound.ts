import * as audio from "tone";
import { Tone } from "./tone";

export async function playTone(tone: Tone, length?: string, time?: number) {
  return new Promise<void>(async (resolve) => {
    await audio.start();
    const synth = new audio.Synth().toDestination();
    synth.triggerAttackRelease(tone, length ?? "8n", time ?? 0);
    resolve();
  });
}

export async function playTones(tones: Tone[]) {
  return new Promise<void>(async (resolve) => {
    await audio.start();
    const synth = new audio.PolySynth(audio.Synth).toDestination();
    synth.triggerAttackRelease(tones, "8n");
    resolve();
  });
}
