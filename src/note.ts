import _ from "lodash";

export type NaturalNote = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type SharpNote = `${NaturalNote}#`;
export type FlatNote = `${NaturalNote}b`;
export type Note = NaturalNote | SharpNote | FlatNote;
export type Accidental = SharpNote | FlatNote;

export const allNotes = _.range(0, 12)
  .map((idx) => indexToNote(idx as any))
  .flat();

export const accidentals = allNotes.filter((note) => isAccidental(note));

export const naturalNote = allNotes.filter((note) => !isAccidental(note));

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
    case "A":
      return 0;
    case "A#":
    case "Bb":
      return 1;
    case "B":
    case "Cb":
      return 2;
    case "B#":
    case "C":
      return 3;
    case "C#":
    case "Db":
      return 4;
    case "D":
      return 5;
    case "D#":
    case "Eb":
      return 6;
    case "E":
    case "Fb":
      return 7;
    case "E#":
    case "F":
      return 8;
    case "F#":
    case "Gb":
      return 9;
    case "G":
      return 10;
    case "G#":
    case "Ab":
      return 11;
    default:
      throw new Error("Unknown tone " + note);
  }
}

export type NoteIndex = ReturnType<typeof noteIndex>;

export function indexToNote(index: NoteIndex): Note[] {
  switch (index) {
    case 0:
      return ["A"];
    case 1:
      return ["A#", "Bb"];
    case 2:
      return ["B", "Cb"];
    case 3:
      return ["C", "B#"];
    case 4:
      return ["C#", "Db"];
    case 5:
      return ["D"];
    case 6:
      return ["D#", "Eb"];
    case 7:
      return ["E", "Fb"];
    case 8:
      return ["F", "E#"];
    case 9:
      return ["F#", "Gb"];
    case 10:
      return ["G"];
    case 11:
      return ["G#", "Ab"];
    default:
      throw new Error("Unknown note index " + index);
  }
}

export function offset(note: Note, semitones: number): NoteIndex {
  return ((noteIndex(note) + semitones) % 12) as NoteIndex;
}

// export class RichNote {
//   private constructor(private index: NoteIndex) {}

//   static fromIndex(index: NoteIndex) {
//     return new RichNote(index);
//   }

//   static fromNote(note: Note) {
//     return RichNote.fromIndex(noteIndex(note));
//   }
// }
