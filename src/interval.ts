import { NoteIndex } from "./note";
import { Tone, toneOps } from "./tone";

export type MajorIntervals = "M2" | "M3" | "M6" | "M7";
export type MinorIntervals = "m2" | "m3" | "m6" | "m7";
export type PerfectIntervals = "p4" | "p5";
export type DiminishedIntervals = "d5" | "d7";
export type AugmentedIntervals = "A4" | "A5";

export type SimpleInterval =
  | MajorIntervals
  | MinorIntervals
  | PerfectIntervals
  | DiminishedIntervals
  | AugmentedIntervals
  | "U";

export type NonUnitaryInterval = Exclude<SimpleInterval, "U">;

export type PositiveDelta = `+${SimpleInterval}`;
export type NegativeDelta = `-${SimpleInterval}`;
export type IntervalDelta = PositiveDelta | NegativeDelta;

export function isPositive(delta: IntervalDelta): delta is PositiveDelta {
  return delta[0] === "+";
}

export function isNegative(delta: IntervalDelta): delta is NegativeDelta {
  return delta[0] === "-";
}

// Octaves + Interval
export type CompoundInterval = [number, SimpleInterval];

export function compoundInterval(octaves: number, interval: SimpleInterval): CompoundInterval {
  return [octaves, interval];
}

export type Interval = SimpleInterval | CompoundInterval;

export function isSimpleInterval(interval: Interval): interval is SimpleInterval {
  return !Array.isArray(interval);
}

export function isCompoundInterval(interval: Interval): interval is CompoundInterval {
  return !isSimpleInterval(interval);
}

export function compoundIntervalWidth(interval: CompoundInterval): number {
  return 12 * interval[0] + intervalWidth(interval[1]);
}

export function widthToCompoundInterval(n: number): CompoundInterval[] {
  const octaves = Math.trunc(n / 12);
  const rest = n - octaves;
  return widthToInterval(rest as any).map((w) => compoundInterval(octaves, w));
}

export function intervalWidth(interval: SimpleInterval): NoteIndex {
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

export function widthToInterval(interval: NoteIndex): SimpleInterval[] {
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

export function invertSimpleInterval(interval: SimpleInterval): SimpleInterval[] {
  return widthToInterval((12 - intervalWidth(interval)) as NoteIndex);
}

export const intervalOps = {
  add(a: Interval, b: Interval): Interval[] {
    return this.fromWidth(this.width(a) + this.width(b));
  },
  offset(a: Interval, semitones: number) {
    return this.fromWidth(this.width(a) + semitones);
  },
  width(a: Interval): number {
    if (isCompoundInterval(a)) {
      return compoundIntervalWidth(a);
    } else {
      return intervalWidth(a);
    }
  },
  fromWidth(a: number): Interval[] {
    return widthToCompoundInterval(a);
  },
  octaves(a: Interval): number {
    return Math.trunc(this.width(a) / 12);
  },
  coerce(a: Interval): SimpleInterval {
    return isSimpleInterval(a) ? a : a[1];
  },
  coerceDelta(a: IntervalDelta): SimpleInterval {
    return a.slice(1) as SimpleInterval;
  },
  deltaWidth(a: IntervalDelta): number {
    const direction: "+" | "-" = a[0] as any;
    const interval = a.slice(1) as SimpleInterval;
    return direction === "-" ? -this.width(interval) : this.width(interval);
  },
  up(a: SimpleInterval): IntervalDelta {
    return `+${a}`;
  },
  down(a: SimpleInterval): IntervalDelta {
    return `-${a}`;
  },
  withDelta(a: Interval, b: IntervalDelta) {
    return this.offset(a, this.deltaWidth(b));
  },
  applyDelta(a: Tone, b: IntervalDelta) {
    if (isNegative(b)) {
      return toneOps.subtract(a, -this.deltaWidth(b));
    } else {
      return toneOps.offset(a, this.deltaWidth(b));
    }
  },
  coerceDown(b: IntervalDelta): IntervalDelta {
    return `-${this.coerceDelta(b)}`;
  },
  coerceUp(b: IntervalDelta): IntervalDelta {
    return `+${this.coerceDelta(b)}`;
  },
  invertDelta(b: IntervalDelta): IntervalDelta {
    const inverted = invertSimpleInterval(this.coerceDelta(b))[0];
    const iv: IntervalDelta = `${b[0]}${inverted}` as any;
    return this.deltaWidth(b) > 0 ? this.coerceDown(iv) : this.coerceUp(iv);
  },
};
