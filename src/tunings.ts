import { isNote, Note } from "./note";

export const standardTuning: Note[] = ["E", "A", "D", "G", "B", "E"];
export const allFourthsTuning: Note[] = ["E", "A", "D", "G", "C", "F"];
export const dropD: Note[] = ["D", "A", "D", "G", "B", "E"];
export const myTuning: Note[] = ["D", "A", "D", "G", "C", "F"];

export type Tuning = {
  name: string;
  notes: Note[];
};

export const allTunings: Tuning[] = [
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
];

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
