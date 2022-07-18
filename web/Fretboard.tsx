import _ from "lodash";
import React, { ReactElement } from "react";
import { allNotes, Note, noteIndex } from "../src/note";
import "./Fretboard.module.css";
import { defaultStringColor } from "./Guitar";

export const defaultFretColor = "#bbbbbb";

export const NORMAL_LABELED_FRET_OFFSETS = [0, 3, 5, 7, 9];
export const ALL_OFFSETS = allNotes.flatMap((x) => noteIndex(x));

export const numericLabel =
  (offsets = NORMAL_LABELED_FRET_OFFSETS) =>
  (fret: number) => {
    return (
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        {fret > 0 && offsets.includes(fret % 12) ? fret : ""}
      </div>
    );
  };

export type FretboardProps = {
  strings: number;
  frets: number;
  fretSize?: number;
  fretColor?: string;
  stringColor?: string;
  getStringSize?: (string: number) => number;
  getLabel: (fret: number) => ReactElement | undefined;
  getFret: (string: number, fret: number, withString?: any, withBorder?: any) => ReactElement;
};

function getStringGradient(size: number, color: string) {
  return `linear-gradient(
    180deg, 
    rgba(0, 0, 0, 0) calc(50% - ${size}px),
    ${color} calc(50% - ${size}px),
    ${color} calc(50% + ${size}px),
    rgba(0, 0, 0, 0) calc(50% + ${size}px))
  `;
}

export type NoteProps = {
  color: string;
  note: Note;
};

export function Note(props: NoteProps) {
  return (
    <div className="fretboard-note" style={{ backgroundColor: props.color }}>
      {props.note}
    </div>
  );
}

export function Fretboard(props: FretboardProps) {
  return (
    <div
      className="fretboard"
      style={{
        color: "#999999",
        gridTemplateRows: `repeat(${props.strings + 1}, 60px)`,
        gridTemplateColumns: `repeat(${props.frets + 1}, 141px)`,
      }}
    >
      {_.range(0, props.frets + 1).map((fret, fretKey) => {
        return (
          <div className="fretboard-labels" key={fretKey}>
            {props.getLabel(fret)}
          </div>
        );
      })}
      {_.range(0, props.strings).flatMap((string, key) => {
        return _.range(0, props.frets + 1).map((fret, fretKey) => {
          return (
            <div
              key={`${key}${fretKey}`}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              {props.getFret(
                string,
                fret,
                {
                  background: getStringGradient(
                    props.getStringSize?.(string) ?? string * 0.34 + 1,
                    props.stringColor ?? defaultStringColor
                  ),
                },
                {
                  borderRight: `${props.fretSize ?? 5}px solid ${props.fretColor ?? defaultFretColor}`,
                }
              )}
            </div>
          );
        });
      })}
    </div>
  );
}
