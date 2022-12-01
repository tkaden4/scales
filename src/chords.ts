import _ from "lodash";
import { indexToNote, noteOps } from "../src/note";
import { Scale } from "../src/scale";
import { IntervalDelta, intervalOps, PositiveDelta } from "./interval";
import { Note, noteDistance } from "./note";
import { Tone, toneNote, toneOps } from "./tone";

// Chord expressed in degrees
export type Degreechord<T extends number, K extends number = number> = Record<K, T>;

export type DiatonicTriad = Degreechord<0 | 1 | 2 | 3 | 4 | 5 | 6, 0 | 1 | 2>;

export function diatonicTriad(root: 0 | 1 | 2 | 3 | 4 | 5 | 6): DiatonicTriad {
  return [root, (root + 2) % 12, (root + 4) % 12] as any;
}

// Chord expressed in tones
export type TonalChord = Tone[][];

// Distances from the root
export type ChordStructure = IntervalDelta[];
export type RootChord = PositiveDelta[];

export type Chord<Structure extends IntervalDelta[]> = {
  name: string;
  structure: Structure;
};

export const majorChord: Chord<RootChord> = {
  name: "Major",
  structure: ["+M3", "+p5"],
};

export const diminishedChord: Chord<RootChord> = {
  name: "Diminished",
  structure: ["+m3", "+d5"],
};

export const minorChord: Chord<RootChord> = {
  name: "Minor",
  structure: ["+m3", "+p5"],
};

export const dominantChord: Chord<RootChord> = {
  name: "Δ7",
  structure: ["+M3", "+p5", "+m7"],
};

export const minMaj7Chord: Chord<RootChord> = {
  name: "minMaj7",
  structure: ["+m3", "+p5", "+M7"],
};

export const maj7Chord: Chord<RootChord> = {
  name: "maj7",
  structure: ["+M3", "+p5", "+M7"],
};

export const min7Chord: Chord<RootChord> = {
  name: "min7",
  structure: ["+m3", "+p5", "+m7"],
};

export const chords = [majorChord, minorChord, dominantChord, minMaj7Chord, maj7Chord, min7Chord, diminishedChord];

export function getInversions(chordStructure: RootChord): ChordStructure[] {
  return _.range(0, chordStructure.length).map((inversion) =>
    chordStructure.map((delta, i) => (i >= inversion ? intervalOps.invertDelta(delta) : delta))
  );
}

export function getChord(chordStructure: ChordStructure, root: Tone): TonalChord {
  const chord: TonalChord = [toneOps.enharmonics(root)];
  for (const interval of chordStructure) {
    chord.push(intervalOps.applyDelta(root, interval));
  }
  return chord;
}

export function getChordNotes(chordStructure: ChordStructure, root: Note): Note[] {
  return _.uniq(
    getChord(chordStructure, `${root}3`)
      .flat()
      .flatMap((x) => toneNote(x))
  );
}

export type ChordFormula = number[];

export function isChord(ns: number[]): ns is ChordFormula {
  return ns.every((n) => n >= 0 && isFinite(n));
}

export type NoteChord = Note[][];

export function getTriads(scale: Scale, center: Note): NoteChord[] {
  const formula = scale.key(center).scaleFormula;
  const triadIntervals = [0, 2, 4] as const;
  const degrees = formula.degrees;
  const positions = _.range(0, degrees);

  const getNote = (position: number) => {
    const interval = formula[position % degrees];
    const note = indexToNote(noteOps.offset(center, interval));
    return note;
  };

  return positions.map((position) => triadIntervals.map((interval) => getNote((interval + position) % degrees)));
}

export function classifyChord(notes: NoteChord): Chord<RootChord> | undefined {
  return chords.find((chord) => {
    const intervals = [0, ...chord.structure.map((x) => intervalOps.deltaWidth(x))];
    const chordIntervals = notes.map((note) => noteDistance(notes[0][0], note[0]));
    return intervals.length === notes.length && chordIntervals.every((chordI, i) => intervals[i] === chordI);
  });
}
