import React from "react";
import { Note } from "../src/note";
import { isTone, Tone } from "../src/tone";
import { coerceColor, ColorLike, colorValue } from "../src/util";
import { ThemeConsumer } from "./ThemeContext";
import { Tone as ToneComponent } from "./Tone";

export type NotePickerProps = {
  justNotes?: boolean;
  value: Tone | Note;
  color: ColorLike;
  invalidColor: ColorLike;
  onChange?: (tone?: Tone) => void;
};

export function NotePicker({ justNotes = true, color, invalidColor, value, onChange = () => {} }: NotePickerProps) {
  const [show, setShow] = React.useState(true);
  const [text, setText] = React.useState(value as string);

  return (
    <ThemeConsumer>
      {(theme) => (
        <div style={{ position: "relative" }}>
          <span onClick={() => setShow(!show)} style={{ cursor: "pointer" }}>
            <ToneComponent color={color} tone={value as Tone} showTone />
          </span>
          {show && (
            <span
              className="fader"
              style={{
                position: "absolute",
                left: 50,
              }}
            >
              <input
                type="text"
                style={{
                  fontFamily: "monospace",
                  width: `${Math.max(text.length + 1, 4)}ch`,
                  fontSize: "16px",
                  backgroundColor: !isTone(text) ? colorValue(coerceColor(invalidColor).alpha(0.2)) : "transparent",
                  color: colorValue(theme.textColor),
                  borderLeft: 0,
                  borderRight: 0,
                  borderTop: 0,
                  borderBottom: `2px solid ${colorValue(isTone(text) ? color : invalidColor)}`,
                  outline: "none",
                }}
                value={text}
                onChange={(e) => {
                  setText(e.target.value.trim());
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    if (isTone(text)) {
                      onChange(text);
                    }
                  }
                }}
                onBlur={() => {
                  if (isTone(text)) {
                    onChange(text);
                  }
                }}
              ></input>
            </span>
          )}
        </div>
      )}
    </ThemeConsumer>
  );
}
