import _ from "lodash";
import { indexToNote, Note, noteIndex, NoteIndex, offset } from "./note";
import { getScale, Key } from "./scale";
import { Tone, toneOps } from "./tone";
import { TonalTuning } from "./tunings";

export class StringTone {
  constructor(public readonly wire: number, public readonly fret: number) {}

  inTuning(tuning: TonalTuning): Tone[] {
    return toneOps.offset(tuning.tones[this.wire], this.fret);
  }
}

export function getFrets(tuning: Note[], nfrets: number) {
  return tuning.map((note) => _.range(0, nfrets + 1).map((fret) => indexToNote(offset(note, fret))));
}

export function printScale(tuning: Note[], scaleDef: Key, nfrets: number) {
  const scale = getScale(scaleDef.keynote, scaleDef.scaleFormula);
  const scaleIndexes = scale.map((x) => noteIndex(x));
  const keyNote = scaleIndexes[0];
  let strings = [];
  for (const stringNote of tuning) {
    let string = `${stringNote}  `;
    const stringNoteIndex = noteIndex(stringNote);
    for (let fret = 0; fret <= nfrets; ++fret) {
      const stringIndex = ((stringNoteIndex + fret) % 12) as NoteIndex;
      if (scaleIndexes.includes(stringIndex)) {
        if (stringIndex === keyNote) {
          string += "-o-";
        } else {
          string += "-x-";
        }
      } else {
        string += "---";
      }
      string += "|";
    }
    strings.push(string);
  }

  const length = strings[0].length;
  const border = _.range(0, length)
    .map(() => "=")
    .join("");
  console.log(border);
  console.log(scaleDef.name);
  console.log("Tuning:", tuning.join(""));
  console.log(
    " ",
    _.range(0, nfrets + 1)
      .map((n) => `| ${n}${n < 10 ? " " : ""}`)
      .join("") + "|"
  );
  console.log(strings.reverse().join("\n"));
  console.log(border);
}
