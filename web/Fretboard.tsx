import CSS from "csstype";
import React from "react";
import { Note } from "../src/note";
import "./Fretboard.module.css";

export type Fret =
  | {
      note: Note;
      inKey: true;
    }
  | {
      notes: Note[];
      inKey: false;
    };

export type FretboardProps = {
  strings: Fret[][];
  styleNote?: (note: Fret) => CSS.Properties;
};

export function Fretboard(props: FretboardProps) {
  return (
    <div
      className="fretboard"
      style={{
        gridTemplateRows: `repeat(${props.strings.length}, 60px)`,
        gridTemplateColumns: `repeat(${props.strings[0].length}, 141px)`,
      }}
    >
      {props.strings.flatMap((string, key) => {
        return string.map((fret, fretKey) => {
          return (
            <div className="fretboard-string" key={`${key}${fretKey}`}>
              <div className="fretboard-cell">
                {fret.inKey ? (
                  <div
                    className={`fretboard-note${fret.inKey ? "" : "-out-of-key"}`}
                    style={props.styleNote?.(fret) ?? {}}
                  >
                    {fret.note}
                  </div>
                ) : (
                  fret.notes.map((fn, key) => (
                    <div
                      key={key}
                      className={`fretboard-note${fret.inKey ? "" : "-out-of-key"}`}
                      style={props.styleNote?.(fret) ?? {}}
                    >
                      {fn}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        });
      })}
    </div>
  );
}
