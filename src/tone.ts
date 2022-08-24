import { isNote } from "tone";
import { accidentals, indexToNote, NaturalNote, naturalNotes, Note, noteIndex } from "./note";

export type Tone = `${Note}${number}`;

export function tone(note: Note, octave: number): Tone {
  return `${note}${octave}`;
}

export function toneChroma(tone: Tone): NaturalNote {
  return tone[0] as any;
}

export function toneOctave(tone: Tone) {
  return +tone.substring(toneNote(tone).length);
}

export function toneNote(tone: Tone): Note {
  if (tone[1] === "#" || tone[1] === "b") {
    return tone.slice(0, 2) as any;
  } else {
    return tone[0] as any;
  }
}
export function toneValue(tone: Tone) {
  return 12 * toneOctave(tone) + noteIndex(toneNote(tone));
}

function fromNumber(t: number): Tone[] {
  const val = t % 12;
  const oct = (t - val) / 12;
  return toneOps.offset(tone("C", oct), val);
}

function octaveIndex(n: Note) {
  switch (n) {
    case "Cb":
      return -1;
    case "C":
      return 0;
    case "C#":
    case "Db":
      return 1;
    case "D":
      return 2;
    case "D#":
    case "Eb":
      return 3;
    case "E":
    case "Fb":
      return 4;
    case "E#":
    case "F":
      return 5;
    case "F#":
    case "Gb":
      return 6;
    case "G":
      return 7;
    case "G#":
    case "Ab":
      return 8;
    case "A":
      return 9;
    case "A#":
    case "Bb":
      return 10;
    case "B":
      return 11;
    case "B#":
      return 12;
  }
}

function fromSemitones(semitones: number): Tone[] {
  const octave = Math.trunc(semitones / 12);
  const note = semitones % 12;
  const noteChroma = indexToNote(note as any);
  return noteChroma.map((note) => {
    const newOctave = octave - Math.trunc(octaveIndex(note) / 12);
    return tone(note, newOctave);
  });
}

export const toneOps = {
  offset(a: Tone, semitones: number): Tone[] {
    return fromSemitones(toneValue(a) + semitones);
  },
  pitchOctave(a: Tone): number {
    return toneOctave(a) + Math.trunc(octaveIndex(toneNote(a)) / 12);
  },
  subtract(a: Tone, semitones: number): Tone[] {
    return fromNumber(toneValue(a) - semitones);
  },
  octaveOffset(a: Tone, tonic: Note): number {
    const t = this.offset(a, 12 - noteIndex(tonic))[0];
    return this.pitchOctave(t);
  },
  interval(a: Tone, b: Tone): number {
    return toneValue(b) - toneValue(a);
  },
  enharmonics(t: Tone): Tone[] {
    return toneOps.offset(t, 0);
  },
};

export function parseTone(s: string): [Tone | Note | undefined, string] {
  const note = accidentals.find((a) => s.startsWith(a)) ?? naturalNotes.find((n) => s.startsWith(n));
  if (note === undefined) {
    return [undefined, s];
  }
  const rrest = s.slice(note.length);
  let rest = s.slice(note.length);
  let n = "";
  while (/\d+/.test(rest[0])) {
    n += rest[0];
    rest = rest.slice(1);
  }
  if (n.length === 0) {
    return [note, rrest];
  }
  return [tone(note, +n), rest];
}

export function isTone(s: string): s is Tone {
  return isNote(s) && toneOctave(s as Tone) < 10;
}
