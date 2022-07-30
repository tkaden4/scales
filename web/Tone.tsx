import React from "react";
import { playTone } from "../src/sound";
import * as tone from "../src/tone";
import { toneNote } from "../src/tone";
import { ColorLike, colorValue } from "../src/util";

export type Circle = {
  color: ColorLike;
  border: string;
  children: any;
};

export function Circle({ color, children, border }: Circle) {
  return <div className="fretboard-note" style={{ backgroundColor: colorValue(color), border }} children={children} />;
}

export type ToneProps = {
  color: ColorLike;
  border?: string;
  tone: tone.Tone;
  showTone: boolean;
  includeOctave?: boolean;
  audible?: boolean;
};

export function Tone(props: ToneProps) {
  return (
    <span
      onClick={
        props.audible
          ? () => {
              playTone(props.tone);
            }
          : () => {}
      }
    >
      <Circle color={props.color} border={props.border ?? ""}>
        {props.showTone ? (props.includeOctave ?? true ? props.tone : toneNote(props.tone)) : ""}
      </Circle>
    </span>
  );
}
