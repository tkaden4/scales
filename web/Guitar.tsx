import React from "react";
import { Tonality } from "../src";
import { Note } from "../src/note";
import { keyNotes } from "../src/scale";
import * as tone from "../src/tone";
import { toneNote, toneOps } from "../src/tone";
import { coerceColor, ColorLike, colorValue } from "../src/util";
import { defaultFretColor, Fretboard, FretboardProps, NORMAL_LABELED_FRET_OFFSETS, Tone } from "./Fretboard";
import { Position } from "./Position";

export const defaultSelectedColor: ColorLike = "#ff5070";
export const defaultUnselectedColor: ColorLike = "#30c2ba";
export const defaultMutedColor: ColorLike = "#dadada";
export const defaultStringColor: ColorLike = "#b0b0b0";
export const defaultNutColor: ColorLike = "#505060";

export const octaveColors = [
  "brown",
  "blue",
  "mediumslateblue",
  "dodgerblue",
  "orangered",
  "crimson",
  "forestgreen",
].map((color) => coerceColor(color).lightness(65));

export function octaveColor(tone: tone.Tone, keyCenter: Note) {
  return coerceColor(octaveColors[toneOps.octaveOffset(tone, keyCenter) % octaveColors.length]);
}

export type GuitarProps = {
  tonality: Tonality;
  frets?: number;
  fretColor?: ColorLike;
  selectedColor?: ColorLike;
  unselectedColor?: ColorLike;
  stringColor?: ColorLike;
  outOfKeyColor?: ColorLike;
  nutColor?: ColorLike;
  showOctaves?: boolean;
} & Partial<FretboardProps>;

export function defaultGetGuitarLabel(fret: number, upper: boolean) {
  return fret > 0 && NORMAL_LABELED_FRET_OFFSETS.includes(fret % 12) ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: upper ? "flex-end" : "flex-start",
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
  nutColor: ColorLike,
  selectedColor: ColorLike,
  outOfKeyColor: ColorLike,
  unselectedColor: ColorLike,
  string: number,
  fret: number,
  withString: any,
  withBorder: any,
  showOctaves: boolean
) {
  const key = tonality.scale.key(tonality.keyCenter);
  const _keyNotes = keyNotes(key);
  const startingNote = tonality.tuning.tones.slice().reverse()[string];
  const notes = toneOps.offset(startingNote, fret);
  const filtered = notes.filter((tone) => _keyNotes.includes(toneNote(tone)));

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: fret > 0 && "border-box",
        ...withBorder,
        ...(fret === 0 ? { borderRight: `10px solid ${nutColor}` } : withString(undefined)),
      }}
    >
      {(filtered.length !== 1 ? notes : filtered).map((tone, key) => (
        <Tone
          key={key}
          tone={tone}
          includeOctave={false}
          border={
            toneNote(tone) === tonality.keyCenter && showOctaves
              ? `4px solid ${colorValue(octaveColor(tone, tonality.keyCenter).rotate(-10).lighten(0.25))}`
              : ""
          }
          color={
            toneNote(tone) === tonality.keyCenter
              ? showOctaves
                ? octaveColor(tone, tonality.keyCenter)
                : selectedColor
              : !_keyNotes.includes(toneNote(tone))
              ? outOfKeyColor
              : showOctaves
              ? octaveColor(tone, tonality.keyCenter)
              : unselectedColor
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
  showOctaves = false,
  ...props
}: GuitarProps) {
  return (
    <Fretboard
      fretColor={fretColor}
      stringColor={stringColor}
      strings={tonality.tuning.tones.length}
      frets={frets}
      getFret={(s, f, w, wb) =>
        defaultGetGuitarFret(
          tonality,
          nutColor,
          selectedColor,
          outOfKeyColor,
          unselectedColor,
          s,
          f,
          w,
          wb,
          showOctaves
        )
      }
      getLabel={props.getLabel ?? defaultGetGuitarLabel}
      {...props}
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
    showOctaves = false,
    ...extra
  } = props;
  return (
    <Position
      strings={props.tonality.tuning.tones.length}
      getFret={(s, f, w, wb) =>
        defaultGetGuitarFret(
          tonality,
          nutColor,
          selectedColor,
          outOfKeyColor,
          unselectedColor,
          s,
          f,
          w,
          wb,
          showOctaves
        )
      }
      getLabel={extra.getLabel ?? defaultGetGuitarLabel}
      frets={frets}
      startingFret={props.startingFret}
      tonality={tonality}
      fretColor={fretColor}
      stringColor={stringColor}
    />
  );
}
