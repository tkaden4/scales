import _ from "lodash";
import { IntervalDelta, intervalOps, PositiveDelta } from "./interval";
import { Tone, toneOps } from "./tone";

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

export const minorChord: Chord<RootChord> = {
  name: "Minor",
  structure: ["+m3", "+p5"],
};

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
