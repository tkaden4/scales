export interface Fret {
  type: "fret";
  fret: number;
}

export interface BendRelease<F, T> {
  type: "bend";
  start: F;
  release: T;
}

export interface HammerOn<F, T> {
  type: "hammer-on";
  from: F;
  to: T;
}

export interface HammerOff<F, T> {
  type: "hammer-off";
  direction: "up" | "down";
  from: F;
  to: T;
}

export interface Slide<F, T> {
  type: "slide";
  from: F;
  to: T;
}
