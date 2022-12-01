import React from "react";
import { Tonality } from "../../src";
import { Chord, classifyChord, getTriads, RootChord } from "../../src/chords";
import { ThemeConsumer } from "../ThemeContext";

export function ChordsPage({ tonality }: { tonality: Tonality }) {
  return (
    <ThemeConsumer>
      {(theme) => {
        const triads = getTriads(tonality.scale, tonality.keyCenter);
        const classified: Chord<RootChord>[] = triads.map((chord) => classifyChord(chord)).filter((x) => x) as any;
        return (
          <>
            {classified.map((ch, i) => {
              return (
                <div>
                  {triads[i][0][0]} {ch.name}
                </div>
              );
            })}
          </>
        );
      }}
    </ThemeConsumer>
  );
}
