import React from "react";
import { Pill } from "./Pill";
import { ThemeConsumer } from "./ThemeContext";

export type DropdownProps = {
  title: string;
  children: any;
};

export function Dropdown(props: DropdownProps) {
  const [visible, setVisible] = React.useState(false);
  return (
    <div>
      <ThemeConsumer>
        {(theme) => (
          <div style={{ position: "relative" }}>
            <div onClick={() => setVisible(!visible)} style={{ cursor: "pointer", userSelect: "none" }}>
              <Pill color={theme.neutralColor}>{props.title}</Pill>
            </div>
            <div>
              {visible && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 5px)",
                    left: 0,
                    zIndex: 100,
                  }}
                  children={props.children}
                />
              )}
            </div>
          </div>
        )}
      </ThemeConsumer>
    </div>
  );
}
