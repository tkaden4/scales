import React from "react";
import { isNaturalNote, Note } from "../src/note";
import { allScales, circleOfFifths, keyNotes, majorScale } from "../src/scale";
import { getFrets } from "../src/strings";
import { allTunings, Tuning } from "../src/tunings";
import { Fret, Fretboard } from "./Fretboard";

const selectedColor = "#fe2040c0";
const unselectedColor = "#20b2aad0";

function chooseNatural(notes: Note[]): Note {
  const filtered = notes.filter((x) => isNaturalNote(x));
  return filtered.length === 0 ? notes[0] : filtered[0];
}

export function App() {
  const [selectedTuning, setSelectedTuning] = React.useState<Tuning>(allTunings[0]);
  const [keyCenter, setKeyCenter] = React.useState<Note>("E");
  const [selectedScale, setSelectedScale] = React.useState(majorScale);

  const key = selectedScale.key(keyCenter);
  const _keyNotes = keyNotes(key);

  const frets = getFrets(selectedTuning.notes, 12)
    .map((gstring) =>
      gstring.map((fret) => {
        const notes = fret.filter((n) => _keyNotes.includes(n));
        return notes.length > 0 ? ({ note: notes[0], inKey: true } as Fret) : ({ notes: fret, inKey: false } as Fret);
      })
    )
    .reverse();

  return (
    <div>
      <h2>Tuning</h2>
      {allTunings.map((tuning, key) => (
        <div
          key={key}
          style={{
            display: "inline-block",
            marginLeft: "5px",
            borderRadius: "5px",
            padding: "0 10px",
            color: "white",
            cursor: "pointer",
            backgroundColor: tuning.name === selectedTuning.name ? selectedColor : unselectedColor,
          }}
          onClick={() => setSelectedTuning(tuning)}
        >
          {tuning.name}
        </div>
      ))}
      <h2>Key</h2>
      {circleOfFifths.map((note, key) => (
        <div
          key={key}
          className="fretboard-note"
          style={{
            display: "inline-block",
            marginLeft: "5px",
            cursor: "pointer",
            backgroundColor: note === keyCenter ? selectedColor : unselectedColor,
          }}
          onClick={() => setKeyCenter(note)}
        >
          {note}
        </div>
      ))}
      <h2>Scale</h2>
      {allScales.map((scale, key) => (
        <div
          key={key}
          style={{
            display: "inline-block",
            marginLeft: "5px",
            borderRadius: "5px",
            padding: "0 10px",
            color: "white",
            cursor: "pointer",
            backgroundColor: scale.name === selectedScale.name ? selectedColor : unselectedColor,
          }}
          onClick={() => setSelectedScale(scale)}
        >
          {scale.name}
        </div>
      ))}
      <h2>Fretboard</h2>
      <Fretboard
        strings={frets}
        styleNote={(n) => (n.inKey && n.note === keyCenter ? { backgroundColor: selectedColor } : {})}
      />
    </div>
  );
}
