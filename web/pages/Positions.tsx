import React from "react";
import { Tonality } from "../../src";
import { getPosition, positionGetFret, positionLength } from "../../src/positions";
import { numericLabel } from "../Fretboard";
import { defaultGuitarNoteProvider, GuitarPosition } from "../Guitar";
import { ThemeConsumer } from "../ThemeContext";

export function PositionsPage({ positions, tonality }: { positions: number[]; tonality: Tonality }) {
  return (
    <ThemeConsumer>
      {(theme) => {
        return positions.map((position, positionKey) => {
          const poz = getPosition(tonality, position);
          return (
            <React.Fragment key={positionKey}>
              <GuitarPosition
                octaveColors
                showOctaves
                nutColor={theme.guitarColors.nutColor}
                fretColor={theme.guitarColors.fretColor}
                stringColor={theme.guitarColors.stringcolor}
                octaveColorsValues={theme.octaveColors}
                outOfKeyColor={theme.mutedColor}
                tonality={tonality}
                labels
                getLabel={numericLabel(true)}
                startingFret={position - 1}
                frets={positionLength(poz)}
                getFret={positionGetFret(poz, (d) => defaultGuitarNoteProvider(d, false))}
              />
              <br />
            </React.Fragment>
          );
        });
      }}
    </ThemeConsumer>
  );
}
