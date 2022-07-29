import _ from "lodash";

export type NaturalNote = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type SharpNote = `${NaturalNote}#`;
export type FlatNote = `${NaturalNote}b`;
export type Note = NaturalNote | SharpNote | FlatNote;
export type Accidental = SharpNote | FlatNote;

export const allNotes = _.range(0, 12)
  .map((idx) => indexToNote(idx as any))
  .flat()
  .sort((a, b) => noteIndex(a) - noteIndex(b));

export const accidentals = allNotes.filter((note) => isAccidental(note));

export const naturalNotes = allNotes.filter((note) => !isAccidental(note));

export function isNote(s: string): s is Note {
  if (s.length > 2) {
    return false;
  }
  return allNotes.map((x) => x as string).includes(s);
}

export function isAccidental(note: Note): note is Accidental {
  return note.length === 2;
}

export function isNaturalNote(note: Note): note is NaturalNote {
  return !isAccidental(note);
}

export function keyChroma(note: Note): NaturalNote {
  return note[0] as any;
}

export function noteIndex(note: NaturalNote | SharpNote | FlatNote) {
  switch (note) {
    case "B#":
    case "C":
      return 0;
    case "C#":
    case "Db":
      return 1;
    case "D":
      return 2;
    case "D#":
    case "Eb":
      return 3;
    case "E":
    case "Fb":
      return 4;
    case "E#":
    case "F":
      return 5;
    case "F#":
    case "Gb":
      return 6;
    case "G":
      return 7;
    case "G#":
    case "Ab":
      return 8;
    case "A":
      return 9;
    case "A#":
    case "Bb":
      return 10;
    case "B":
    case "Cb":
      return 11;
    default:
      throw new Error("Unknown tone " + note);
  }
}

export type NoteIndex = ReturnType<typeof noteIndex>;

export function indexToNote(index: NoteIndex): Note[] {
  switch (index) {
    case 0:
      return ["C", "B#"];
    case 1:
      return ["C#", "Db"];
    case 2:
      return ["D"];
    case 3:
      return ["D#", "Eb"];
    case 4:
      return ["E", "Fb"];
    case 5:
      return ["F", "E#"];
    case 6:
      return ["F#", "Gb"];
    case 7:
      return ["G"];
    case 8:
      return ["G#", "Ab"];
    case 9:
      return ["A"];
    case 10:
      return ["A#", "Bb"];
    case 11:
      return ["B", "Cb"];
    default:
      throw new Error("Unknown note index " + index);
  }
}

export function offset(note: Note, semitones: number): NoteIndex {
  return ((noteIndex(note) + semitones) % 12) as NoteIndex;
}

export function invert(noteIndex: NoteIndex): NoteIndex {
  return (11 - noteIndex) as NoteIndex;
}

export function* foreverNotes(startingPosition: Note) {
  for (let i: NoteIndex = noteIndex(startingPosition); ; i = offset(indexToNote(i)[0], 1)) {
    yield indexToNote(i);
  }
}

export function noteDistance(lower: Note, upper: Note) {
  return ((noteIndex(upper) - noteIndex(lower) + 12) % 12) as NoteIndex;
}

export const noteOps = {
  offset(note: Note, semitones: number) {
    return offset(note, semitones);
  },
};
