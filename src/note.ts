export type WholeNote = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type SharpNote = `${WholeNote}#`;
export type FlatNote = `${WholeNote}b`;
export type Note = WholeNote | SharpNote | FlatNote;
export type Accidental = SharpNote | FlatNote;

export function isAccidental(note: Note): note is Accidental {
  return note.length === 2;
}

export function keyChroma(note: Note): WholeNote {
  if (isAccidental(note)) {
    return note[0] as any as WholeNote;
  } else {
    return note;
  }
}

export function noteIndex(note: WholeNote | SharpNote | FlatNote) {
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
      return ["E#", "F"];
    case 9:
      return ["F#", "Gb"];
    case 10:
      return ["G"];
    case 11:
      return ["G#", "Ab"];
  }
}
