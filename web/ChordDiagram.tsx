import React from "react";
import { Tonality } from "../src";
import { ChordStructure, getChordNotes } from "../src/chords";
import { intervalOps } from "../src/interval";
import { Note } from "../src/note";
import { getTonalTuningIntervals } from "../src/positions";
import { toneNote } from "../src/tone";
import { TonalTuning } from "../src/tunings";
import { coerceColor, ColorLike } from "../src/util";
import { Fret, Fretboard } from "./Fretboard";
import { defaultGuitarNoteProvider, GuitarNoteProvider, GuitarPosition } from "./Guitar";

export const defaultChordColors = ["red", "green", "blue"].map((x) =>
  coerceColor(x).lighten(0.3).desaturate(0.2).rotate(-10)
);

export type ChordDiagramProps = {
  tonality: Tonality;
  root: Note;
  chordStructure: ChordStructure;
  colors?: ColorLike[];
  strict?: boolean;
};

export function Chord({
  chordStructure,
  tuning,
}: Omit<ChordDiagramProps, "strict" | "root" | "tonality"> & { tuning: TonalTuning }) {
  const tuningIntervals = getTonalTuningIntervals(tuning);
  const partialSums = tuningIntervals.reduce(
    (acc, x) => {
      return [...acc, acc[acc.length - 1] + x];
    },
    [0]
  );
  return (
    <Fretboard
      frets={4}
      strings={tuning.tones.length}
      getLabel={() => {}}
      getFret={(s, f, ws, wb) => {
        const interval = chordStructure.find((delta, i) => intervalOps.deltaWidth(delta) === partialSums[s]);
        return <Fret></Fret>;
      }}
    />
  );
}

export function chordFretProvider(chord: ChordStructure, root: Note, colors: ColorLike[]): GuitarNoteProvider {
  const notes = getChordNotes(chord, root);
  const cc = Object.fromEntries(notes.map((x, i) => [x, colors[i % colors.length]]));
  return (tones, props) => {
    const isInChord = tones.some((tone) => notes.includes(toneNote(tone)));
    const color =
      tones
        .map((tone) => toneNote(tone))
        .map((y) => cc[y])
        .filter((x) => x)[0] ?? "black";
    return defaultGuitarNoteProvider(false, !isInChord)(
      isInChord ? tones.filter((x) => notes.includes(toneNote(x))) : [],
      {
        ...props,
        showNotes: false,
        selectedColor: color,
        outOfKeyColor: color,
        unselectedColor: color,
      }
    );
  };
}

export function ChordDiagram({ tonality, chordStructure, root, colors, strict = false }: ChordDiagramProps) {
  return (
    <GuitarPosition
      rotation={0}
      startingFret={0}
      tonality={tonality}
      strings={tonality.tuning.tones.length}
      frets={5}
      labels={false}
      getFret={chordFretProvider(chordStructure, root, colors ?? defaultChordColors)}
    />
  );
}
