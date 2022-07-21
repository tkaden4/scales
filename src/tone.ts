import { accidentals, indexToNote, NaturalNote, naturalNotes, Note, noteIndex, noteOps } from "./note";

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

export const toneOps = {
  offset(a: Tone, semitones: number): Tone[] {
    const octave = toneOctave(a);
    const chromaDiff = (semitones + 12) % 12;
    const octaveDiff = Math.trunc((semitones + noteIndex(toneNote(a))) / 12);
    const chroma = noteOps.offset(toneNote(a), chromaDiff);
    return indexToNote(chroma).map((n) => tone(n, octave + octaveDiff));
  },
  octaveOffset(a: Tone, tonic: Note): number {
    const t = this.offset(a, 12 - noteIndex(tonic))[0];
    return toneOctave(t);
  },
  interval(a: Tone, b: Tone): number {
    return toneValue(b) - toneValue(a);
  },
};

export function enharmonics(t: Tone): Tone[] {
  return toneOps.offset(t, 0);
}

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
