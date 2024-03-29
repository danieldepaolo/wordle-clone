import { useEffect } from "react"

import WordleBoardLetter from "./WordleBoardLetter"
import { WordleBoard as WordleBoardType, WordleRow } from "./types"

export interface WordleBoardRowProps {
  rowLetters: WordleRow
  rowNum: number
}

export const WordleBoardRow = (
  { rowLetters = [], rowNum }: WordleBoardRowProps
) => {
  return (
    <div className='wordle-row'>
      {rowLetters.map((letterObj, i) => (
        <WordleBoardLetter key={`row-${rowNum}-pos${i}`} letterObj={letterObj} />
      ))}
    </div>
  )
}

export interface WordleBoardProps {
  boardState: WordleBoardType
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
      {boardState.map((row, i) => (
        <WordleBoardRow key={`row-${i}`} rowLetters={row} rowNum={i} />
      ))}
      {errMsg && <div className='user-message error-message'>{errMsg}</div>}
      {!!gameEndMsg && <div className='user-message game-end-message'>{gameEndMsg}</div>}
    </div>
  )
}
