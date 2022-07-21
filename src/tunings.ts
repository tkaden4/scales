import { isNote, Note, noteDistance } from "./note";
import { getTuningIntervals } from "./positions";
import { parseTone, tone, Tone, toneNote, toneOps } from "./tone";

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

function _parseTuning(tuning: string): (Note | Tone)[] {
  const [note, rest] = parseTone(tuning.trim());
  if (note === undefined) {
    throw new Error(`${tuning} is an invalid tuning.`);
  }
  return [note, ...(rest.length > 0 ? _parseTuning(rest) : [])];
}

export function parseTuning(tuning: string): Tone[] {
  return fixTuning(_parseTuning(tuning));
}

export function fixTuning(tn: (Tone | Note)[], highestOctave = 4): Tone[] {
  if (tn.length == 0) {
    return [];
  }

  function fixTuningSolo(a: Tone): Tone[] {
    return [a];
  }
  function fixTuningSoloB(b: Note): Tone[] {
    return [tone(b, highestOctave)];
  }

  function fixTuningA(a: Note, b: Tone, rest: (Tone | Note)[]): Tone[] {
    const distance = noteDistance(a, toneNote(b));
    return [toneOps.subtract(b, distance)[0], ...fixTuning([b, ...rest])];
  }

  function fixTuningB(a: Tone, b: Note, rest: (Tone | Note)[]): Tone[] {
    const distance = noteDistance(toneNote(a), b);
    return [a, ...fixTuning([toneOps.offset(a, distance)[0], ...rest])];
  }

  function fixTuningC(a: Tone, b: Tone, rest: (Tone | Note)[]): Tone[] {
    return [a, ...fixTuning([b, ...rest])];
  }

  function fixTuningD(a: Note, b: Note, rest: (Tone | Note)[]): Tone[] {
    const moreFixed = fixTuning([b, ...rest]);
    return fixTuning([a, ...moreFixed]);
  }

  const [a, b, ...rest] = tn;
  const aIsNote = isNote(a);
  if (b === undefined) {
    return isNote(a) ? fixTuningSoloB(a) : fixTuningSolo(a);
  }
  const bIsNote = isNote(b);
  if (aIsNote && bIsNote) {
    return fixTuningD(a, b, rest);
  } else if (aIsNote && !bIsNote) {
    return fixTuningA(a, b, rest);
  } else if (!aIsNote && bIsNote) {
    return fixTuningB(a, b, rest);
  } else if (!aIsNote && !bIsNote) {
    return fixTuningC(a, b, rest);
  } else {
    throw new Error("Impossible");
  }
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
