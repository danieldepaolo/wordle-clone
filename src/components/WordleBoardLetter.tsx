import { LetterState, T_WorldBoardLetter } from "../types"
import { getBoardLetterClass } from "../util"

interface WordleLetterProps {
  boardLetter: T_WorldBoardLetter
}

const WordleBoardLetter = ({ boardLetter }: WordleLetterProps) => {
  const { state, letter } = boardLetter

  const evaluated = state !== LetterState.DEFAULT

  return (
    <div
      className={[
        'wordle-letter',
        'wordle-board-letter',
        getBoardLetterClass(state),
        letter && 'wordle-board-letter--filled',
        evaluated && 'letter-evaluated wordle-board-letter--evaluated'
      ].filter(Boolean)
       .join(' ')}
    >
      {letter}
    </div>
  )
}

export default WordleBoardLetter
