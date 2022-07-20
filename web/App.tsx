import React from "react";
import { HashRouter, Link, useLocation } from "react-router-dom";
import { Tonality } from "../src";
import { accidentals, allNotes, naturalNotes } from "../src/note";
import { getPosition, positionGetFret, positionLength } from "../src/positions";
import { allScales, majorScale } from "../src/scale";
import { allTunings, parseTuning, toTonalTuning } from "../src/tunings";
import { numericLabel } from "./Fretboard";
import { defaultGuitarNoteProvider, Guitar, GuitarPosition } from "./Guitar";

const selectedColor = "#fe2040c0";
const unselectedColor = "#20b2aad0";
const mutedColor = "#bababaa0";

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

const positions = [1, 3, 4, 7];

export function getURLFromProps(props: ScaleToolProps) {
  return `?scale=${encodeURIComponent(props.scale)}&keyCenter=${encodeURIComponent(
    props.keyCenter
  )}&tuning=${encodeURIComponent(props.tuning)}`;
}

function ScaleTool(props: ScaleToolProps) {
  const selectedScale = allScales.find((s) => s.name === props.scale) ?? majorScale;
  const keyCenter = allNotes.find((n) => n === props.keyCenter) ?? "E";
  const selectedTuning =
    allTunings.find((t) => t.name === props.tuning) ??
    toTonalTuning(
      {
        name: props.tuning,
        notes: parseTuning(props.tuning),
      },
      2
    );
  const tonality: Tonality = {
    keyCenter: keyCenter,
    scale: selectedScale,
    tuning: selectedTuning,
  };

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
      {[...naturalNotes, ...accidentals].map((note, key) => (
        <Link to={getURLFromProps({ ...props, keyCenter: note })} key={key}>
          <div
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
        <Link to={getURLFromProps({ ...props, scale: scale.name })} key={key}>
          <div
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
      <Guitar tonality={tonality} />
      <h2>Positions</h2>
      {positions.map((position, positionKey) => {
        const poz = getPosition(tonality, position);
        return (
          <React.Fragment key={positionKey}>
            <GuitarPosition
              octaveColors
              key={positionKey * 2 + 1}
              tonality={tonality}
              labels
              getLabel={numericLabel()}
              startingFret={position - 1}
              frets={positionLength(poz)}
              getFret={positionGetFret(poz, defaultGuitarNoteProvider)}
            />
            <br key={positionKey * 2} />
          </React.Fragment>
        );
      })}
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
    <HashRouter basename="/">
      <Main />
    </HashRouter>
  );
}
