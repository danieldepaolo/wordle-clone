import { LetterState, WordleLetter } from "./types"
import { getBoardLetterClass } from "./util"

interface WordleLetterProps {
  letterObj: WordleLetter
}

const WordleBoardLetter = ({ letterObj }: WordleLetterProps) => {
  const evaluated = letterObj.state !== LetterState.DEFAULT

  return (
    <div
      className={[
        'wordle-letter',
        'wordle-board-letter',
        getBoardLetterClass(letterObj.state),
        letterObj.letter && 'wordle-board-letter--filled',
        evaluated && 'letter-evaluated wordle-board-letter--evaluated'
      ].filter(Boolean)
       .join(' ')}
    >
      {letterObj.letter}
    </div>
  )
}

export default WordleBoardLetter
