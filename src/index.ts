import { Note } from "./note";
import { Scale } from "./scale";
import { Tuning } from "./tunings";

export type Tonality = {
  keyCenter: Note;
  scale: Scale;
  tuning: Tuning;
};
