import React from "react";
import { Tonality } from "../../src";
import { Guitar } from "../Guitar";
import { ThemeConsumer } from "../ThemeContext";

export function FretboardPage({ tonality }: { tonality: Tonality }) {
  return (
    <ThemeConsumer>
      {(theme) => (
        <Guitar
          tonality={tonality}
          octaveColors
          showOctaves
          stringColor={theme.guitarColors.stringcolor}
          fretColor={theme.guitarColors.fretColor}
          outOfKeyColor={theme.mutedColor}
          selectedColor={theme.secondaryColor}
          unselectedColor={theme.primaryColor}
          nutColor={theme.guitarColors.nutColor}
          octaveColorsValues={theme.octaveColors}
        />
      )}
    </ThemeConsumer>
  );
}
