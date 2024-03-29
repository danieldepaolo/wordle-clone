import { useEffect } from "react"

import WordleBoardLetter from "./WordleBoardLetter"
import { T_WordleRow, T_WorldBoardLetter, T_WordleBoard } from "../types"

export interface WordleBoardRowProps {
  rowLetters: T_WordleRow
}

export const WordleBoardRow = (
  { rowLetters = [] }: WordleBoardRowProps
) => {
  return (
    <div className='wordle-row'>
      {rowLetters.map((boardLetter: T_WorldBoardLetter) => (
        <WordleBoardLetter
          key={`row-${boardLetter.row}-pos${boardLetter.position}`}
          boardLetter={boardLetter}
        />
      ))}
    </div>
  )
}

export interface WordleBoardProps {
  boardState: T_WordleBoard
  errMsg: string
  setErrMsg: (msg: string) => void
  gameEndMsg: string
}

export const WordleBoard = ({ boardState, errMsg, setErrMsg, gameEndMsg }: WordleBoardProps) => {
  useEffect(() => {
    let timeout: number
    if (errMsg) {
      timeout = setTimeout(() => setErrMsg(''), 1500)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [errMsg])
  
  return (
    <div className='wordle-board'>
      {boardState.map((row: T_WordleRow, i: number) => (
        <WordleBoardRow key={`row-${i}`} rowLetters={row} />
      ))}
      {errMsg && <div className='user-message error-message'>{errMsg}</div>}
      {!!gameEndMsg && <div className='user-message game-end-message'>{gameEndMsg}</div>}
    </div>
  )
}
