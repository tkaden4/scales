import { indexToNote, keyChroma, Note, noteIndex, NoteIndex } from "./note";

export type HeptatonicScaleFormula = [NoteIndex, NoteIndex, NoteIndex, NoteIndex, NoteIndex, NoteIndex, NoteIndex];
export type ScaleDegree<Scale extends number[]> = keyof Scale;
export type HeptatonicScaleDegree = ScaleDegree<HeptatonicScaleFormula>;

export const majorScaleFormula: HeptatonicScaleFormula = [0, 2, 4, 5, 7, 9, 11];
export const minorScaleFormula: HeptatonicScaleFormula = [0, 2, 3, 5, 7, 8, 10];
export const harmonicMinorScaleFormula: HeptatonicScaleFormula = [0, 2, 3, 5, 7, 8, 11];

export type Scale = {
  name: string;
  keynote: Note;
  scaleFormula: HeptatonicScaleFormula;
};

export const harmonicMinorScale = (note: Note): Scale => ({
  name: `${note} harmonic minor scale`,
  keynote: note,
  scaleFormula: harmonicMinorScaleFormula,
});

export const majorScale = (note: Note): Scale => ({
  name: `${note} major scale`,
  keynote: note,
  scaleFormula: majorScaleFormula,
});

export const circleOfFifths: Note[] = ["F", "C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb"];

export function getScale(keynote: Note, scale: HeptatonicScaleFormula) {
  let tones: Note[] = [];
  const startIndex = noteIndex(keynote);
  for (const scaleDegree of scale) {
    const tone = indexToNote(((startIndex + scaleDegree) % 12) as any);
    const candidates = tone.filter((x) => !tones.map((x) => keyChroma(x)).includes(keyChroma(x)));
    const finalCandidates =
      candidates.length === 1 ? candidates : candidates.sort((a, b) => noteIndex(a) - noteIndex(b));
    if (finalCandidates.length == 0) {
      console.log(tone, candidates, finalCandidates);
      // idk if this is even possible
      throw new Error("could not construct scale");
    }
    tones.push(finalCandidates[0]);
  }
  return tones;
}
