import React from "react";
import { Tonality } from "../src";
import { Note } from "../src/note";
import { keyNotes } from "../src/scale";
import * as tone from "../src/tone";
import { toneNote, toneOps } from "../src/tone";
import { coerceColor, ColorLike, colorValue } from "../src/util";
import { defaultFretColor, Fretboard, FretboardProps, FretProvider, NORMAL_LABELED_FRET_OFFSETS } from "./Fretboard";
import { Position } from "./Position";
import { Tone } from "./Tone";

export const defaultSelectedColor: ColorLike = "#ff5070";
export const defaultUnselectedColor: ColorLike = "#30c2ba";
export const defaultOutOfKeyColor: ColorLike = "#dadada";
export const defaultStringColor: ColorLike = "#b0b0b0";
export const defaultNutColor: ColorLike = "#505060";

export interface GuitarColors {
  nutColor: ColorLike;
  fretColor: ColorLike;
  stringcolor: ColorLike;
}

export function octaveColor(t: tone.Tone, keyCenter: Note, octaveColors: ColorLike[]) {
  return coerceColor(octaveColors[toneOps.octaveOffset(t, keyCenter) % octaveColors.length]);
}

export type GuitarNoteProvider = (tone: tone.Tone[], guitarProps: GuitarProps) => FretProvider;

export type GuitarProps = {
  tonality: Tonality;
  showNotes?: boolean;
  frets?: number;
  fretColor?: ColorLike;
  selectedColor?: ColorLike;
  unselectedColor?: ColorLike;
  stringColor?: ColorLike;
  outOfKeyColor?: ColorLike;
  nutColor?: ColorLike;
  showOctaves?: boolean;
  octaveColors?: boolean;
  octaveColorsValues?: ColorLike[];
  getFret?: GuitarNoteProvider;
} & Omit<Partial<FretboardProps>, "getFret">;

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
        .repeat(fret % 12 ? 1 : fret / 12 + 1)
        .split("")
        .join(" ")}
    </div>
  ) : (
    <></>
  );
}

export function basicRenderGuitarFret(
  showTone: boolean,
  keyNote: Note[],
  notes: tone.Tone[],
  tonality: Tonality,
  disable: boolean,
  nutColor: ColorLike,
  selectedColor: ColorLike,
  outOfKeyColor: ColorLike,
  unselectedColor: ColorLike,
  string: number,
  fret: number,
  withString: any,
  withBorder: any,
  showOctaves: boolean,
  octaveColors: boolean,
  octaveColorsArray: string[]
) {
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
      {notes.map((tone, key) => (
        <Tone
          showTone={showTone}
          key={key}
          tone={tone}
          includeOctave={showOctaves}
          border={
            !disable && toneNote(tone) === tonality.keyCenter && octaveColors
              ? `4px solid ${colorValue(
                  octaveColor(tone, tonality.keyCenter, octaveColorsArray).rotate(-10).lighten(0.25)
                )}`
              : ""
          }
          color={
            disable
              ? outOfKeyColor
              : toneNote(tone) === tonality.keyCenter
              ? octaveColors
                ? octaveColor(tone, tonality.keyCenter, octaveColorsArray)
                : selectedColor
              : !keyNote.includes(toneNote(tone))
              ? outOfKeyColor
              : octaveColors
              ? octaveColor(tone, tonality.keyCenter, octaveColorsArray)
              : unselectedColor
          }
        />
      ))}
    </div>
  );
}

export function defaultGetGuitarFret(
  tone: tone.Tone[],
  showTone: boolean,
  tonality: Tonality,
  disable: boolean,
  nutColor: ColorLike,
  selectedColor: ColorLike,
  outOfKeyColor: ColorLike,
  unselectedColor: ColorLike,
  string: number,
  fret: number,
  withString: any,
  withBorder: any,
  showOctaves: boolean,
  octaveColors: boolean,
  octaveColorsArray: ColorLike[]
) {
  const key = tonality.scale.key(tonality.keyCenter);
  const _keyNotes = keyNotes(key);
  const notes = tone;
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
          showTone={showTone}
          key={key}
          tone={tone}
          includeOctave={showOctaves}
          border={
            !disable && toneNote(tone) === tonality.keyCenter && octaveColors
              ? `4px solid ${colorValue(
                  octaveColor(tone, tonality.keyCenter, octaveColorsArray).rotate(-10).lighten(0.25)
                )}`
              : ""
          }
          color={
            disable
              ? outOfKeyColor
              : toneNote(tone) === tonality.keyCenter
              ? octaveColors
                ? octaveColor(tone, tonality.keyCenter, octaveColorsArray)
                : selectedColor
              : !_keyNotes.includes(toneNote(tone))
              ? outOfKeyColor
              : octaveColors
              ? octaveColor(tone, tonality.keyCenter, octaveColorsArray)
              : unselectedColor
          }
        />
      ))}
    </div>
  );
}

export const onlyNotes =
  (notes: Note[], fallback: (noNote: boolean) => GuitarNoteProvider): GuitarNoteProvider =>
  (tones, props) =>
  (string, fret, w, w0) => {
    return fallback(!tones.some((tone) => notes.includes(toneNote(tone))))(tones, props)(string, fret, w, w0);
  };

export const defaultGuitarNoteProvider =
  (disable: boolean, noNote: boolean): GuitarNoteProvider =>
  (tone, props) =>
  (string, fret, w, w0) =>
    defaultGetGuitarFret(
      tone,
      !noNote,
      props.tonality,
      disable,
      props.nutColor ?? defaultNutColor,
      props.selectedColor ?? defaultSelectedColor,
      props.outOfKeyColor ?? defaultOutOfKeyColor,
      props.unselectedColor ?? defaultUnselectedColor,
      string,
      fret,
      w,
      w0,
      props.showOctaves ?? false,
      props.octaveColors ?? false,
      props.octaveColorsValues ?? ["red"]
    );

export function Guitar(_props: GuitarProps) {
  const {
    tonality,
    selectedColor = defaultSelectedColor,
    unselectedColor = defaultUnselectedColor,
    stringColor = defaultStringColor,
    outOfKeyColor = defaultOutOfKeyColor,
    nutColor = defaultNutColor,
    fretColor = defaultFretColor,
    frets = 12,
    showOctaves = false,
    octaveColors = false,
    showNotes = true,
    getFret,
    ...props
  } = _props;
  return (
    <Fretboard
      fretColor={fretColor}
      stringColor={stringColor}
      strings={tonality.tuning.tones.length}
      frets={frets}
      getFret={(string, fret, w, wb) => {
        const startingNote = tonality.tuning.tones.slice().reverse()[string];
        const notes = toneOps.offset(startingNote, fret);

        return (
          getFret?.(notes, _props)(string, fret, w, wb) ??
          defaultGetGuitarFret(
            notes,
            showNotes,
            tonality,
            false,
            nutColor,
            selectedColor,
            outOfKeyColor,
            unselectedColor,
            string,
            fret,
            w,
            wb,
            showOctaves,
            octaveColors,
            props.octaveColorsValues ?? [selectedColor]
          )
        );
      }}
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
    outOfKeyColor = defaultOutOfKeyColor,
    nutColor = defaultNutColor,
    frets = 12,
    showOctaves = false,
    octaveColors = false,
    showNotes = true,
    ...extra
  } = props;
  return (
    <Position
      strings={props.tonality.tuning.tones.length}
      getFret={(string, fret, w, wb) => {
        const startingNote = tonality.tuning.tones.slice().reverse()[string];
        const notes = toneOps.offset(startingNote, fret);

        return (
          extra.getFret?.(notes, props)(string, fret, w, wb) ??
          defaultGetGuitarFret(
            notes,
            showNotes,
            tonality,
            false,
            nutColor,
            selectedColor,
            outOfKeyColor,
            unselectedColor,
            string,
            fret,
            w,
            wb,
            showOctaves,
            octaveColors,
            props.octaveColorsValues ?? []
          )
        );
      }}
      getLabel={extra.getLabel ?? defaultGetGuitarLabel}
      frets={frets}
      startingFret={props.startingFret}
      tonality={tonality}
      fretColor={fretColor}
      stringColor={stringColor}
      rotation={extra.rotation}
      labels={extra.labels}
    />
  );
}
