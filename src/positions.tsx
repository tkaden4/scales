import _ from "lodash";
import { Tonality, tonalityNotes } from ".";
import { GuitarNoteProvider } from "../web/Guitar";
import { Note, noteIndex } from "./note";
import { Tone, toneNote, toneOps } from "./tone";
import { TonalTuning, Tuning } from "./tunings";

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

export function getTonalTuningIntervals(tuning: TonalTuning): number[] {
  const result: number[] = [];
  const notes = tuning.tones;
  for (let i = 0; i < notes.length - 1; ++i) {
    result.push(toneOps.interval(notes[i], notes[i + 1]));
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

export function stringsWithEnharmonics(tonality: Tonality, offset: number = 0) {
  const intervals = getTonalTuningIntervals(tonality.tuning);
  return _.range(0, tonality.tuning.tones.length).map((s) =>
    _.range(-1, intervals[s % intervals.length]).map((idx) => toneOps.offset(tonality.tuning.tones[s], offset + idx))
  );
}

export type Position = Tone[][];

export function positionLength(position: Position): number {
  return Math.max(...position.map((s) => s.length)) + 1;
}

export function getPosition(tonality: Tonality, offset: number = 0): Position {
  const ss = stringsWithEnharmonics(tonality, offset);
  const notes = tonalityNotes(tonality);

  return ss.map((s: Tone[][]) => {
    return s.flatMap((alts: Tone[]): Tone[] => alts.filter((alt: Tone) => notes.includes(toneNote(alt))));
  });
}

export const positionGetFret =
  (position: Position, defaultProvider: (disable: boolean) => GuitarNoteProvider): GuitarNoteProvider =>
  (tones, props) =>
  (s, f, ws, wb) => {
    const correctOrder = position.slice().reverse();
    const thisString = correctOrder[s];
    const isPastEnd = false;
    const isInPreviousString = s > 0 && tones.some((tone) => correctOrder[s - 1].includes(tone));
    const enable = tones.some((tone) => thisString.includes(tone)) && !isInPreviousString && !isPastEnd;
    return defaultProvider(!enable)(tones, props)(s, f, ws, wb);
  };

export function octaveShapes(tonality: Tonality) {}
