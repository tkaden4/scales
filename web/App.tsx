import React from "react";
import { HashRouter, Link, useLocation } from "react-router-dom";
import { allNotes } from "../src/note";
import { allScales, circleOfFifths, keyNotes, majorScale } from "../src/scale";
import { getFrets } from "../src/strings";
import { allTunings } from "../src/tunings";
import { Fret, Fretboard } from "./Fretboard";

const selectedColor = "#fe2040c0";
const unselectedColor = "#20b2aad0";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

type ScaleToolProps = {
  scale: string;
  keyCenter: string;
  tuning: string;
};

export function getURLFromProps(props: ScaleToolProps) {
  return `/?scale=${props.scale}&keyCenter=${props.keyCenter}&tuning=${props.tuning}`;
}

function ScaleTool(props: ScaleToolProps) {
  const selectedScale = allScales.find((s) => s.name === props.scale)!;
  const keyCenter = allNotes.find((n) => n === props.keyCenter)!;
  const selectedTuning = allTunings.find((t) => t.name === props.tuning)!;
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
        <Link to={getURLFromProps({ ...props, tuning: tuning.name })} key={key}>
          <div
            style={{
              display: "inline-block",
              marginLeft: "5px",
              borderRadius: "5px",
              padding: "0 10px",
              color: "white",
              cursor: "pointer",
              backgroundColor: tuning.name === selectedTuning.name ? selectedColor : unselectedColor,
            }}
          >
            {tuning.name}
          </div>
        </Link>
      ))}
      <h2>Key</h2>
      {circleOfFifths.map((note, key) => (
        <Link to={getURLFromProps({ ...props, keyCenter: note })}>
          <div
            key={key}
            className="fretboard-note"
            style={{
              display: "inline-block",
              marginLeft: "5px",
              cursor: "pointer",
              backgroundColor: note === keyCenter ? selectedColor : unselectedColor,
            }}
          >
            {note}
          </div>
        </Link>
      ))}
      <h2>Scale</h2>
      {allScales.map((scale, key) => (
        <Link to={getURLFromProps({ ...props, scale: scale.name })}>
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
          >
            {scale.name}
          </div>
        </Link>
      ))}
      <h2>Fretboard</h2>
      <Fretboard
        strings={frets}
        styleNote={(n) => (n.inKey && n.note === keyCenter ? { backgroundColor: selectedColor } : {})}
      />
    </div>
  );
}

export function Main() {
  let query = useQuery();
  const keyCenter = query.get("keyCenter");
  const tuning = query.get("tuning");
  const scale = query.get("scale");
  return (
    <ScaleTool keyCenter={keyCenter ?? "E"} scale={scale ?? majorScale.name} tuning={tuning ?? allTunings[0].name} />
  );
}

export function App() {
  return (
    <HashRouter basename="/scales/">
      <Main />
    </HashRouter>
  );
}
