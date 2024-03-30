import {
  LetterState,
  T_WordleBoard,
  T_WordleRow,
  T_WorldBoardLetter,
  WordleLetterPosition
} from "./types";

export function placeLetterOnBoard(
  board: T_WordleBoard,
  letter: string,
  location: WordleLetterPosition
): T_WordleBoard {
  const newBoard = [...board]

  newBoard[location.row][location.position] = {
    letter,
    state: LetterState.DEFAULT,
    ...location,
  }

  return newBoard
}

export function evaluateBoardRow(row: T_WordleRow, goalWord: string): T_WordleRow {
  const goalWordCharCount = goalWord.split('').reduce((acc, curr) => {
    acc[curr] === undefined ? acc[curr] = 1 : acc[curr] += 1
    return acc
  }, {} as Record<string, number>)

  const evaluatedRow = structuredClone(row)

  evaluatedRow.forEach((boardLetter: T_WorldBoardLetter) => {
    const { position, letter } = boardLetter

    if (goalWord[position] === letter) {
      goalWordCharCount[letter] -= 1
      evaluatedRow[position] = {
        ...boardLetter,
        state: LetterState.CORRECT
      }
    }
  })

  evaluatedRow.forEach((boardLetter: T_WorldBoardLetter) => {
    const { position, letter } = boardLetter

    if (goalWordCharCount[letter] > 0) {
      goalWordCharCount[letter] -= 1
      evaluatedRow[position] = {
        ...boardLetter,
        state: LetterState.PRESENT
      }
    }
  })

  evaluatedRow.forEach((boardLetter: T_WorldBoardLetter) => {
    const { state, position } = boardLetter

    if (state === LetterState.DEFAULT) {
      evaluatedRow[position] = {
        ...boardLetter,
        state: LetterState.ABSENT
      }
    }
  })

  return evaluatedRow
}