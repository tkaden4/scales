import _ from "lodash";
import React, { ReactElement } from "react";
import { allNotes, noteIndex } from "../src/note";
import { Tone, toneNote } from "../src/tone";
import { ColorLike, colorValue } from "../src/util";
import "./Fretboard.module.css";
import { defaultStringColor } from "./Guitar";

export const defaultFretColor = "#bbbbbb";

export const NORMAL_LABELED_FRET_OFFSETS = [0, 3, 5, 7, 9];
export const ALL_OFFSETS = allNotes.flatMap((x) => noteIndex(x));

export const noLabel = (fret: number) => {};

export const numericLabel =
  (offsets = NORMAL_LABELED_FRET_OFFSETS) =>
  (fret: number) => {
    return (
      <div
        style={{
          display: "inline-flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "flex-end",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        {fret > 0 && offsets.includes(fret % 12) ? fret : ""}
      </div>
    );
  };

export type FretProvider = (string: number, fret: number, withString?: any, withBorder?: any) => ReactElement;
export type LabelProvider = (fret: number, lower: boolean) => ReactElement | undefined | void;
export type FretboardProps = {
  strings: number;
  frets: number;
  fretSize?: number;
  fretColor?: ColorLike;
  stringColor?: ColorLike;
  labels?: boolean;
  getStringSize?: (string: number) => number;
  getLabel: LabelProvider;
  getFret: FretProvider;
};

function getStringGradient(size: number, color: ColorLike, backgroundColor: ColorLike = "rgba(0, 0, 0, 0)") {
  return `linear-gradient(
    180deg, 
    ${colorValue(backgroundColor)} calc(50% - ${size}px),
    ${colorValue(color)} calc(50% - ${size}px),
    ${colorValue(color)} calc(50% + ${size}px),
    ${colorValue(backgroundColor)} calc(50% + ${size}px))
  `;
}

export type NoteProps = {
  color: ColorLike;
  border?: string;
  tone: Tone;
  includeOctave?: boolean;
};

export function Tone(props: NoteProps) {
  return (
    <div className="fretboard-note" style={{ backgroundColor: colorValue(props.color), border: props.border }}>
      {props.includeOctave ?? true ? props.tone : toneNote(props.tone)}
    </div>
  );
}

export function Fretboard(props: FretboardProps) {
  return (
    <div
      className="fretboard"
      style={{
        color: "#999999",
        gridTemplateRows: `repeat(${props.strings + (props.labels ?? true ? 2 : 0)}, 60px)`,
        gridTemplateColumns: `repeat(${props.frets + 1}, 141px)`,
      }}
    >
      {(props.labels ?? true) &&
        _.range(0, props.frets + 1).map((fret, fretKey) => {
          return (
            <div className="fretboard-labels" key={fretKey}>
              {props.getLabel(fret, true) ?? <></>}
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
                (background?: string) => ({
                  background: getStringGradient(
                    props.getStringSize?.(string) ?? string * 0.34 + 1,
                    props.stringColor ?? defaultStringColor,
                    background
                  ),
                }),
                {
                  borderRight: `${props.fretSize ?? 5}px solid ${props.fretColor ?? defaultFretColor}`,
                }
              )}
            </div>
          );
        });
      })}
      {(props.labels ?? true) &&
        _.range(0, props.frets + 1).map((fret, fretKey) => {
          return (
            <div className="fretboard-labels" key={fretKey}>
              {props.getLabel(fret, false) ?? <></>}
            </div>
          );
        })}
    </div>
  );
}
