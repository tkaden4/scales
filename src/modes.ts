import { ScaleFormula } from "./scale";

export function getMode(scale: ScaleFormula, mode: Mode): ScaleFormula {
  const intervals = [];
  for (let i = 0; i < scale.degrees; ++i) {
    const distance = (scale[(i + mode.startingDegree) % scale.degrees] - scale[mode.startingDegree] + 12) % 12;
    intervals.push(distance);
  }
  return {
    degrees: scale.degrees,
    ...intervals,
  };
}

export type Mode = {
  name: string;
  startingDegree: number;
};

export const modes: Mode[] = [
  {
    name: "Ionian",
    startingDegree: 0,
  },
  {
    name: "Dorian",
    startingDegree: 1,
  },
  {
    name: "Phrygian",
    startingDegree: 2,
  },
  {
    name: "Lydian",
    startingDegree: 3,
  },
  {
    name: "Mixolydian",
    startingDegree: 4,
  },
  {
    name: "Aeolian",
    startingDegree: 5,
  },
  {
    name: "Locrian",
    startingDegree: 6,
  },
];
