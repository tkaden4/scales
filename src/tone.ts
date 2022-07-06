import { Note, WholeNote } from "./note";

export type Tone = `${Note}${number}`;

export function toneChroma(tone: Tone): WholeNote {
  return tone[0] as any;
}

export function toneNote(tone: Tone): Note {
  if (tone[1] === "#" || tone[1] === "b") {
    return tone.slice(0, 2) as any;
  } else {
    return tone[0] as any;
  }
}

export const middleC: Tone = "C4";
