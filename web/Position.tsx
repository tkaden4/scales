import React from "react";
import { Tonality } from "../src";
import { Fretboard, FretboardProps } from "./Fretboard";

export type PositionProps = {
  startingFret: number;
  tonality: Tonality;
} & FretboardProps;

export function Position(props: PositionProps) {
  const getLabel = React.useCallback(
    (fret: number, lower: boolean) => {
      return props.getLabel(fret + props.startingFret, lower);
    },
    [props.getLabel]
  );
  const getFret = React.useCallback(
    (string: number, fret: number, a: any, b: any) => {
      return props.getFret(string, fret + props.startingFret, a, b);
    },
    [props.getFret]
  );
  return <Fretboard {...props} getLabel={getLabel} getFret={getFret} />;
}
