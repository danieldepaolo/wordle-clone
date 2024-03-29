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

export interface T_WordleLetter {
  letter: string;
  state: LetterState;
}

export interface WordleLetterPosition {
  row: number;
  position: number;
}

export type T_WorldBoardLetter = T_WordleLetter & WordleLetterPosition

export type T_WordleRow = T_WorldBoardLetter[]
export type T_WordleBoard = T_WordleRow[]
