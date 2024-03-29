export enum LetterState {
  CORRECT = 3,
  PRESENT = 2,
  ABSENT = 1,
  DEFAULT = 0
}

export enum KeyType {
  ENTER = 'Enter',
  BACKSPACE = 'Undo',
}

export type KeyboardKey = string | KeyType

export interface WordleLetter {
  letter: string;
  state: LetterState;
}

export interface WordleLetterPosition {
  row: number;
  position: number;
}

export type WordleRow = WordleLetter[]
export type WordleBoard = WordleRow[]
