import { ScaleFormula } from "./scale";

export function mode(scale: ScaleFormula, scaleDegree: number): ScaleFormula {
  return new Proxy(scale, {
    get(target, p, r) {
      const i = +(p as any);
      return target[(i + scaleDegree) % scale.degrees];
    },
  });
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
