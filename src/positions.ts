import { Note, noteIndex } from "./note";
import { Tuning } from "./tunings";

export function noteDistance(tuning: Tuning, string0: number, fret0: number, string1: number, fret1: number) {}

// TODO technically tunings use notes of particular absolute pitches, but we assume ascending notes here, never over an octave.
// This is gonna work for guitar
export function getTuningIntervals(tuning: Tuning): number[] {
  const result: number[] = [];
  const notes = tuning.notes;
  for (let i = 0; i < notes.length - 1; ++i) {
    result.push((noteIndex(notes[i + 1]) - noteIndex(notes[i]) + 12) % 12);
  }
  return result;
}

export function rotateIntoPosition(notes: Note[], position: number): Note[] {
  const result: Note[] = [];
  for (let i = -position; i < notes.length - position; ++i) {
    result.push(notes[(i + notes.length) % notes.length]);
  }
  return result;
}

export type Position = {
  startingFret: number;
  strings: Note[][];
};
