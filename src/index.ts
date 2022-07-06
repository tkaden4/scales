import _ from "lodash";
import { Note, noteIndex, NoteIndex } from "./note";
import { getScale, majorScale, Scale } from "./scale";

function printScale(tuning: Note[], scaleDef: Scale, nfrets: number) {
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

printScale(["D", "A", "D", "G", "C", "F"], majorScale("D"), 24);
