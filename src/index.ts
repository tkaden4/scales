import { Note } from "./note";
import { Scale } from "./scale";
import { TonalTuning, Tuning } from "./tunings";

export type OldTonality = {
  keyCenter: Note;
  scale: Scale;
  tuning: Tuning;
};

export type Tonality = {
  keyCenter: Note;
  scale: Scale;
  tuning: TonalTuning;
};
