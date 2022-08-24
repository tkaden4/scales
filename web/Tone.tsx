import React from "react";
import * as tone from "../src/tone";
import { toneNote } from "../src/tone";
import { ColorLike, colorValue } from "../src/util";

export type CircleButtonProps = {
  onClick?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
} & CircleProps;

export function CircleButton(props: CircleButtonProps) {
  return (
    <span
      style={{
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={props.onClick}
      onMouseEnter={props.onHover}
      onMouseLeave={props.onHoverEnd}
    >
      <Circle {...props} />
    </span>
  );
}

export type CircleProps = {
  color: ColorLike;
  border?: string;
  children: any;
};

export function Circle({ color, children, border = "" }: CircleProps) {
  return (
    <div
      className="fretboard-note"
      style={{ backgroundColor: colorValue(color), border, userSelect: "none" }}
      children={children}
    />
  );
}

export type ToneProps = {
  color: ColorLike;
  border?: string;
  tone: tone.Tone;
  showTone: boolean;
  includeOctave?: boolean;
};

export function Tone(props: ToneProps) {
  return (
    <Circle color={props.color} border={props.border ?? ""}>
      {props.showTone ? (props.includeOctave ?? true ? props.tone : toneNote(props.tone)) : ""}
    </Circle>
  );
}
