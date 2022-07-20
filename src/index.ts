import { Note } from "./note";
import { keyNotes, Scale } from "./scale";
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

export function tonalityNotes(tonality: Tonality): Note[] {
  return keyNotes(tonality.scale.key(tonality.keyCenter));
}
