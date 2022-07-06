import _ from "lodash";
import { Note, noteIndex, NoteIndex } from "./note";
import { getScale, harmonicMinorScale, Scale } from "./scale";

function printScale(tuning: Note[], scaleDef: Scale, nfrets: number) {
  const scale = getScale(scaleDef.keynote, scaleDef.scaleFormula);
  const scaleIndexes = scale.map((x) => noteIndex(x));
  const keyNote = scaleIndexes[0];
  let strings = [];
  for (const stringNote of tuning) {
    let string = `${stringNote} `;
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
  console.log(
    _.range(0, nfrets + 1)
      .map((x) => " . .")
      .join("")
  );
  console.log(scaleDef.name);
  console.log("Tuning:", tuning.join(""));
  console.log(
    " ",
    _.range(0, nfrets + 1)
      .map((n) => ` ${n}${n < 10 ? " " : ""}`)
      .join("|")
  );
  console.log(strings.reverse().join("\n"));
  console.log(
    _.range(0, nfrets + 1)
      .map((x) => " . .")
      .join("")
  );
}

printScale(["D", "A", "D", "G", "C", "F"], harmonicMinorScale("D"), 12);
