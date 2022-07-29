import { getMode, modes } from "./modes";
import { indexToNote, isNaturalNote, keyChroma, Note, noteIndex, NoteIndex } from "./note";

export type HeptatonicScaleFormula = [NoteIndex, NoteIndex, NoteIndex, NoteIndex, NoteIndex, NoteIndex, NoteIndex];
export type ScaleDegree<Scale extends number[]> = keyof Scale;
export type HeptatonicScaleDegree = ScaleDegree<HeptatonicScaleFormula>;

export const majorScaleFormula: HeptatonicScaleFormula = [0, 2, 4, 5, 7, 9, 11];
export const minorScaleFormula: HeptatonicScaleFormula = [0, 2, 3, 5, 7, 8, 10];
export const harmonicMinorScaleFormula: HeptatonicScaleFormula = [0, 2, 3, 5, 7, 8, 11];

export type ScaleFormula = {
  degrees: number;
  [x: number]: number;
};

export type Key = {
  name: string;
  keynote: Note;
  scaleFormula: ScaleFormula;
};

export interface Scale {
  name: string;
  key: (note: Note) => Key;
}

export const harmonicMinorScale: Scale = {
  name: "Harmonic Minor",
  key: (note) => ({
    name: `${note} Harmonic Minor Scale`,
    keynote: note,
    scaleFormula: { degrees: 7, ...harmonicMinorScaleFormula },
  }),
};

export const doubleHarmonicMinorScale: Scale = {
  name: "Double Harmonic",
  key(note: Note) {
    return {
      name: `${note} Double Harmonic Scale`,
      keynote: note,
      scaleFormula: {
        degrees: 7,
        ...harmonicMinorScaleFormula,
        1: harmonicMinorScaleFormula[1] - 1,
        2: harmonicMinorScaleFormula[2] + 1,
      },
    };
  },
};

export const minorScale: Scale = {
  name: "Minor",
  key: (note) => ({
    name: `${note} Minor Scale`,
    keynote: note,
    scaleFormula: { degrees: 7, ...minorScaleFormula },
  }),
};

export const majorScale: Scale = {
  name: "Major",
  key: (note) => ({
    name: `${note} Major Scale`,
    keynote: note,
    scaleFormula: { degrees: 7, ...majorScaleFormula },
  }),
};

export const chromaticScale: Scale = {
  name: "Chromatic",
  key: (note) => ({
    name: "Chromatic Scale",
    keynote: note,
    scaleFormula: {
      degrees: 12,
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
      11: 11,
    },
  }),
};

export const allScales: Scale[] = [
  majorScale,
  minorScale,
  harmonicMinorScale,
  doubleHarmonicMinorScale,
  chromaticScale,
  ...modes.map((mode) => ({
    name: mode.name,
    key: (note: Note): Key => ({
      keynote: note,
      name: mode.name,
      scaleFormula: getMode(
        {
          degrees: majorScaleFormula.length,
          ...majorScaleFormula,
        },
        mode
      ),
    }),
  })),
];

export function keyNotes(key: Key) {
  return getScale(key.keynote, key.scaleFormula);
}

export function getScale(keynote: Note, scale: ScaleFormula) {
  const tones: Note[] = [keynote];
  const startIndex = noteIndex(keynote);
  for (let i = 1; i < scale.degrees; ++i) {
    const scaleDegree = scale[i];
    const tone = indexToNote(((startIndex + scaleDegree) % 12) as any);
    const candidates = tone.filter((x) => !tones.map((x) => keyChroma(x)).includes(keyChroma(x)));
    const finalCandidates =
      candidates.length === 1 ? candidates : candidates.sort((a, b) => noteIndex(a) - noteIndex(b));
    if (finalCandidates.length == 0) {
      tones.push(chooseNatural(tone));
    } else {
      tones.push(finalCandidates[0]);
    }
  }
  return tones;
}

export function chooseNatural(notes: Note[]): Note {
  const filtered = notes.filter((x) => isNaturalNote(x));
  return filtered.length === 0 ? notes[0] : filtered[0];
}
