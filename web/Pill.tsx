import React from "react";
import { ColorLike, colorValue } from "../src/util";

export type PillProps = {
  children: any;
  color: ColorLike;
  textColor?: ColorLike;
};

export function Pill(props: PillProps) {
  return (
    <div
      style={{
        display: "inline-block",
        marginRight: "10px",
        borderRadius: "5px",
        padding: "0 10px",
        color: colorValue(props.textColor ?? "white"),
        cursor: "pointer",
        backgroundColor: colorValue(props.color),
      }}
      children={props.children}
    />
  );
}

export function PillButton(props: PillProps & { onClick: () => void }) {
  return (
    <div onClick={props.onClick} style={{ cursor: "pointer", userSelect: "none" }}>
      <Pill {...props} />
    </div>
  );
}
