import { NoteIndex } from "./note";

export type MajorIntervals = "M2" | "M3" | "M6" | "M7";
export type MinorIntervals = "m2" | "m3" | "m6" | "m7";
export type PerfectIntervals = "p4" | "p5";
export type DiminishedIntervals = "d5" | "d7";
export type AugmentedIntervals = "A4" | "A5";

export type Interval =
  | MajorIntervals
  | MinorIntervals
  | PerfectIntervals
  | DiminishedIntervals
  | AugmentedIntervals
  | "U";

export function intervalDistance(interval: Interval): NoteIndex {
  switch (interval) {
    case "U":
      return 0;
    case "m2":
      return 1;
    case "M2":
      return 2;
    case "m3":
      return 3;
    case "M3":
      return 4;
    case "p4":
      return 5;
    case "d5":
    case "A4":
      return 6;
    case "p5":
      return 7;
    case "m6":
    case "A5":
      return 8;
    case "M6":
    case "d7":
      return 9;
    case "m7":
      return 10;
    case "M7":
      return 11;
    default:
      throw new Error("Unknown interval " + interval);
  }
}

export function distanceToInterval(interval: NoteIndex): Interval[] {
  switch (interval) {
    case 0:
      return ["U"];
    case 1:
      return ["m2"];
    case 2:
      return ["M2"];
    case 3:
      return ["m3"];
    case 4:
      return ["M3"];
    case 5:
      return ["p4"];
    case 6:
      return ["d5", "A4"];
    case 7:
      return ["p5"];
    case 8:
      return ["m6", "A5"];
    case 9:
      return ["M6", "d7"];
    case 10:
      return ["m7"];
    case 11:
      return ["M7"];
    default:
      throw new Error("Unknown interval " + interval);
  }
}
