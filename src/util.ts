import { LetterState } from "./types"

export function getKeyboardLetterClass(state: LetterState) {
  switch(state) {
    case LetterState.ABSENT:
      return 'absent-state'
    case LetterState.PRESENT:
      return 'present-state'
    case LetterState.CORRECT:
      return 'correct-state'
    default:
      return 'default-key-state'
  }
}

export function getBoardLetterClass(state: LetterState) {
  const className = getKeyboardLetterClass(state)
  return className === 'default-key-state'
    ? 'default-board-letter-state'
    : className
}

export function delay(delayMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs)
  })
}
