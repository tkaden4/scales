import _ from "lodash";
import React, { ReactElement } from "react";
import { allNotes, noteIndex } from "../src/note";
import { ColorLike, colorValue } from "../src/util";
import "./Fretboard.module.css";
import { defaultNutColor, defaultStringColor } from "./Guitar";

export const defaultFretColor = "#bbbbbb";

export const NORMAL_LABELED_FRET_OFFSETS = [0, 3, 5, 7, 9];
export const ALL_OFFSETS = allNotes.flatMap((x) => noteIndex(x));

export const noLabel = (fret: number) => {};

export const numericLabel =
  (both = false, offsets = NORMAL_LABELED_FRET_OFFSETS): LabelProvider =>
  (fret: number, lower) => {
    return both || !lower ? (
      <div
        style={{
          display: "inline-flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: lower ? "flex-start" : "flex-end",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        {fret > 0 && offsets.includes(fret % 12) ? fret : ""}
      </div>
    ) : undefined;
  };

export type FretProvider = (string: number, fret: number, withString?: any, withBorder?: any) => ReactElement;
export type LabelProvider = (fret: number, lower: boolean) => ReactElement | undefined | void;
export type FretboardProps = {
  rotation?: number;
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

export type FretProps = {
  stringSize?: number;
  stringColor?: string;
  fretSize?: number;
  fretColor?: string;
  nutColor?: string;
  nut?: boolean;
  children?: any;
};

export function Fret({ children, stringSize, nutColor, nut = false, stringColor, fretColor, fretSize }: FretProps) {
  const withString = (background?: string) => ({
    background: getStringGradient(stringSize ?? 1, stringColor ?? defaultStringColor, background),
  });
  const withBorder = {
    borderRight: `${fretSize ?? 5}px solid ${fretColor ?? defaultFretColor}`,
  };
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: !nut ? "border-box" : undefined,
        ...withBorder,
        ...(nut ? { borderRight: `10px solid ${nutColor ?? defaultNutColor}` } : withString(undefined)),
      }}
      children={children}
    />
  );
}

export function Fretboard(props: FretboardProps) {
  return (
    <div
      className="fretboard"
      style={{
        transform: `rotate(${props.rotation ?? 0}deg)`,
        color: "#999999",
        gridTemplateRows: `repeat(${props.strings + (props.labels ?? true ? 2 : 1)}, 60px)`,
        gridTemplateColumns: `repeat(${props.frets + 1}, 141px)`,
      }}
    >
      {(props.labels ?? true) &&
        _.range(0, props.frets + 1).map((fret, fretKey) => {
          return (
            <div className="fretboard-labels" key={`upper-${fret}`}>
              {props.getLabel(fret, false) ?? <></>}
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
            <div className="fretboard-labels" key={`lower-${fret}`}>
              {props.getLabel(fret, true) ?? <></>}
            </div>
          );
        })}
    </div>
  );
}
