import React from "react";
import { Tonality } from "../src";
import { indexToNote, offset } from "../src/note";
import { keyNotes } from "../src/scale";
import { defaultFretColor, Fretboard, Note } from "./Fretboard";
import { Position } from "./Position";

export const defaultSelectedColor = "#ff5070";
export const defaultUnselectedColor = "#30c2ba";
export const defaultMutedColor = "#dadada";
export const defaultStringColor = "#b0b0b0";
export const defaultNutColor = "#505060";

export type GuitarProps = {
  tonality: Tonality;
  frets?: number;
  fretColor?: string;
  selectedColor?: string;
  unselectedColor?: string;
  stringColor?: string;
  outOfKeyColor?: string;
  nutColor?: string;
};

export const NORMAL_LABELED_FRET_OFFSETS = [0, 3, 5, 7, 9];

export function defaultGetGuitarLabel(fret: number) {
  return fret > 0 && NORMAL_LABELED_FRET_OFFSETS.includes(fret % 12) ? (
    <div
      style={{
        color: "#00000055",
        width: "100%",
        height: "100%",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      {"⬤"
        .repeat(fret % 12 ? 1 : 2)
        .split("")
        .join(" ")}
    </div>
  ) : (
    <></>
  );
}

export function defaultGetGuitarFret(
  tonality: Tonality,
  nutColor: string,
  selectedColor: string,
  outOfKeyColor: string,
  unselectedColor: string,
  string: number,
  fret: number,
  withString: any,
  withBorder: any
) {
  const key = tonality.scale.key(tonality.keyCenter);
  const _keyNotes = keyNotes(key);
  const startingNote = tonality.tuning.notes.slice().reverse()[string];
  const notes = indexToNote(offset(startingNote, fret));
  const filtered = notes.filter((x) => _keyNotes.includes(x));
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        ...withBorder,
        ...(fret === 0 ? { borderRight: `10px solid ${nutColor}` } : withString),
      }}
    >
      {(filtered.length !== 1 ? notes : filtered).map((note) => (
        <Note
          note={note}
          color={
            note === tonality.keyCenter ? selectedColor : !_keyNotes.includes(note) ? outOfKeyColor : unselectedColor
          }
        />
      ))}
    </div>
  );
}

export function Guitar({
  tonality,
  selectedColor = defaultSelectedColor,
  unselectedColor = defaultUnselectedColor,
  stringColor = defaultStringColor,
  outOfKeyColor = defaultMutedColor,
  nutColor = defaultNutColor,
  fretColor = defaultFretColor,
  frets = 12,
}: GuitarProps) {
  return (
    <Fretboard
      fretColor={fretColor}
      stringColor={stringColor}
      strings={tonality.tuning.notes.length}
      frets={frets}
      getFret={(s, f, w, wb) =>
        defaultGetGuitarFret(tonality, nutColor, selectedColor, outOfKeyColor, unselectedColor, s, f, w, wb)
      }
      getLabel={defaultGetGuitarLabel}
    />
  );
}

export type GuitarPositionProps = {
  startingFret: number;
  tonality: Tonality;
} & GuitarProps;

export function GuitarPosition(props: GuitarPositionProps) {
  const {
    tonality,
    selectedColor = defaultSelectedColor,
    unselectedColor = defaultUnselectedColor,
    stringColor = defaultStringColor,
    fretColor = defaultFretColor,
    outOfKeyColor = defaultMutedColor,
    nutColor = defaultNutColor,
    frets = 12,
  } = props;
  return (
    <Position
      strings={props.tonality.tuning.notes.length}
      getFret={(s, f, w, wb) =>
        defaultGetGuitarFret(tonality, nutColor, selectedColor, outOfKeyColor, unselectedColor, s, f, w, wb)
      }
      getLabel={defaultGetGuitarLabel}
      frets={frets}
      startingFret={props.startingFret}
      tonality={tonality}
      fretColor={fretColor}
      stringColor={stringColor}
    />
  );
}
