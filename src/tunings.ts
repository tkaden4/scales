import { isNote, Note } from "./note";
import { getTuningIntervals } from "./positions";
import { tone, Tone, toneOps } from "./tone";

export const standardTuning: Note[] = ["E", "A", "D", "G", "B", "E"];
export const allFourthsTuning: Note[] = ["E", "A", "D", "G", "C", "F"];
export const dropD: Note[] = ["D", "A", "D", "G", "B", "E"];
export const myTuning: Note[] = ["D", "A", "D", "G", "C", "F"];

export type Tuning = {
  name: string;
  notes: Note[];
};

export const allTunings: TonalTuning[] = [
  {
    name: "Standard Tuning",
    notes: standardTuning,
  },
  {
    name: "All Fourths Tuning",
    notes: allFourthsTuning,
  },
  {
    name: "Drop D Tuning",
    notes: dropD,
  },
  {
    name: "Kaden's Tuning",
    notes: myTuning,
  },
].map((x) => toTonalTuning(x, 2));

function parseNote(s: string): [Note | undefined, string] {
  if (s.length === 0) {
    return [undefined, s];
  }
  const seg = s.slice(0, 2);
  if (isNote(seg)) {
    return [seg, s.slice(2)];
  } else {
    const smaller = s.slice(0, 1);
    if (isNote(smaller)) {
      return [smaller, s.slice(1)];
    } else {
      return [undefined, s];
    }
  }
}

export function parseTuning(tuning: string): Note[] {
  const [note, rest] = parseNote(tuning);
  if (note === undefined) {
    throw new Error(`${tuning} is an invalid tuning.`);
  }
  return [note, ...(rest.length > 0 ? parseTuning(rest) : [])];
}

export type TonalTuning = {
  name: string;
  tones: Tone[];
};

export function toTonalTuning(tuning: Tuning, octave: number): TonalTuning {
  const intervals = getTuningIntervals(tuning);
  const firstTone = tone(tuning.notes[0], octave);
  const result: Tone[] = [firstTone];
  for (const distance of intervals) {
    result.push(toneOps.offset(result[result.length - 1], distance)[0]);
  }
  return {
    name: tuning.name,
    tones: result,
  };
}
