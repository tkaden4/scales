import { indexToNote, keyChroma, Note, noteIndex, NoteIndex } from "./note";

export type HeptatonicScaleFormula = [NoteIndex, NoteIndex, NoteIndex, NoteIndex, NoteIndex, NoteIndex, NoteIndex];
export type ScaleDegree<Scale extends number[]> = keyof Scale;
export type HeptatonicScaleDegree = ScaleDegree<HeptatonicScaleFormula>;

export const majorScaleFormula: HeptatonicScaleFormula = [0, 2, 4, 5, 7, 9, 11];
export const minorScaleFormula: HeptatonicScaleFormula = [0, 2, 3, 5, 7, 8, 10];
export const harmonicMinorScaleFormula: HeptatonicScaleFormula = [0, 2, 3, 5, 7, 8, 11];

export type Key = {
  name: string;
  keynote: Note;
  scaleFormula: HeptatonicScaleFormula;
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
    scaleFormula: harmonicMinorScaleFormula,
  }),
};

export const minorScale: Scale = {
  name: "Minor",
  key: (note) => ({
    name: `${note} Minor Scale`,
    keynote: note,
    scaleFormula: minorScaleFormula,
  }),
};

export const majorScale: Scale = {
  name: "Major",
  key: (note) => ({
    name: `${note} Major Scale`,
    keynote: note,
    scaleFormula: majorScaleFormula,
  }),
};

// export const chromaticScale: Scale = {
//   name: "Chromatic",
//   key: (note) => ({
//     name: "Chromatic Scale",
//     keynote: note,
//     scaleFormula:
//   })
// }

export const allScales = [majorScale, minorScale, harmonicMinorScale];

export const circleOfFifths: Note[] = ["F", "C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb"];

export function keyNotes(key: Key) {
  return getScale(key.keynote, key.scaleFormula);
}

export function getScale(keynote: Note, scale: HeptatonicScaleFormula) {
  const tones: Note[] = [keynote];
  const startIndex = noteIndex(keynote);
  for (const scaleDegree of scale.slice(1)) {
    const tone = indexToNote(((startIndex + scaleDegree) % 12) as any);
    const candidates = tone.filter((x) => !tones.map((x) => keyChroma(x)).includes(keyChroma(x)));
    const finalCandidates =
      candidates.length === 1 ? candidates : candidates.sort((a, b) => noteIndex(a) - noteIndex(b));
    if (finalCandidates.length == 0) {
      tones.push(tone[0]);
    } else {
      tones.push(finalCandidates[0]);
    }
  }
  return tones;
}
