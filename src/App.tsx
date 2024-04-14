import { useEffect, useRef, useState } from 'react'

import { WordleKeyboard } from './components/WordleKeyboard'
import { WordleBoard } from './components/WordleBoard'

import {
  LetterState,
  T_WorldBoardLetter,
  T_WordleBoard,
  WordleLetterPosition,
  T_WordleRow,
  KeyboardKey
} from './types'
import {
  ALPHABET,
  DEFAULT_LETTER_OBJ,
  NUM_ROWS,
  WORDS,
  WORD_LENGTH
} from './constants'

import './styles/App.css'
import { fetchRandomWords } from './api'
import { delay } from './util'
import { evaluateBoardRow, placeLetterOnBoard } from './wordleBoardSvc'

function App() {
  const [wordleBoard, setWordleBoard] = useState<T_WordleBoard>(
    Array.from({ length: NUM_ROWS }).map((_, i) =>
      Array.from({ length: WORD_LENGTH }).map((_, j) => ({
        ...DEFAULT_LETTER_OBJ,
        row: i,
        position: j
      }))
    )
  )

  const [nextLetterSpot, setNextLetterSpot] = useState<WordleLetterPosition>({
    row: 0,
    position: 0
  })

  const [keyboardLetterState, setKeyboardLetterState] = useState<Record<KeyboardKey, LetterState>>(
    ALPHABET.reduce((acc, char) => {
      return {
        ...acc,
        [char]: LetterState.DEFAULT
      }
    }, {})
  )

  const [errMsg, setErrMsg] = useState('')
  const [gameEndMsg, setGameEndMsg] = useState('')

  const endpointCalled = useRef(false) // Make sure we only call endpoint once
  const goalWord = useRef(WORDS[(Math.floor(Math.random() * WORDS.length))])
  const gameOver = !!gameEndMsg

  useEffect(() => {
    const func = async () => {
      if (!endpointCalled.current) {
        endpointCalled.current = true
        const word = await determineGoalWord()
        if (word !== null) {
          goalWord.current = word
        }
      }
    }

    func()
  }, [])

  async function determineGoalWord(): Promise<string | null> {
    try {
      const words = await fetchRandomWords({
        number: 1,
        length: 5
      })
      return words?.[0] || null
    } catch (err) {
      console.error(err)
      return null
    }
  }

  function handleUserAction(userAction: Function): Function {
    return function(...args: any[]) {
      if (!gameOver) {
        userAction(...args)
      }
    }
  }

  function handlePressLetter(letter: string): void {
    if (nextLetterSpot.position < WORD_LENGTH) {
      const newBoard = placeLetterOnBoard(wordleBoard, letter, nextLetterSpot)
      setWordleBoard(newBoard)

      setNextLetterSpot(prev => ({
        ...prev,
        position: prev.position + 1
      }))
    }
  }

  async function handlePressEnter(): Promise<void> {
    const { row, position } = nextLetterSpot

    if (position === WORD_LENGTH) {
      const newRow = evaluateBoardRow(wordleBoard[row], goalWord.current)

      const promises = newRow.map((boardLetter) => setLetterStateDelayed(boardLetter))
      await Promise.all(promises)

      setKeyboardLetterState(prev => {
        const newState = structuredClone(prev)
        newRow.forEach(({ state, letter }) => {
          if (state > newState[letter]) {
            newState[letter] = state
          }
        })
        return newState
      })
  
      if (!determineEndOfGame(row, newRow)) {
        setNextLetterSpot(prev => ({
          row: prev.row + 1,
          position: 0
        }))
      }
    } else {
      setErrMsg('Word incomplete')
    }
  }

  function handlePressBackspace(): void {
    const { row, position } = nextLetterSpot
    const prevLetterSpot = {
      row,
      position: position - 1
    }

    if (position > 0) {
      setWordleBoard(prev => {
        const newBoard = structuredClone(prev)
        newBoard[row][position - 1] = {
          ...DEFAULT_LETTER_OBJ,
          ...prevLetterSpot
        }
        return newBoard
      })

      setNextLetterSpot(prevLetterSpot)
    }
  }
  
  async function setLetterStateDelayed(
    newBoardLetter: T_WorldBoardLetter,
    delayMs = 300
  ): Promise<void> {
    const { row, position } = newBoardLetter

    await delay(position * delayMs)

    setWordleBoard(prev => {
      const newBoard = structuredClone(prev)
      newBoard[row][position] = newBoardLetter
      return newBoard
    })
  }

  function determineEndOfGame(rowNum: number, row: T_WordleRow): boolean {
    const isWin = row.every(({ state }) =>
      state === LetterState.CORRECT
    )
    const usedAllGuesses = rowNum === NUM_ROWS - 1

    if (isWin) {
      setGameEndMsg('You have won!')
    } else if (usedAllGuesses) {
      setGameEndMsg('You lost. Better luck next time.')
    }

    return isWin || usedAllGuesses
  }

  return (
    <div className='app'>
      <div className='app-header'>
        Wordle Clone
      </div>
      <hr className='divider' />
      <WordleBoard
        boardState={wordleBoard}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
        gameEndMsg={gameEndMsg}
      />
      <WordleKeyboard
        onPressLetter={handleUserAction(handlePressLetter)}
        onPressEnter={handleUserAction(handlePressEnter)}
        onPressBackspace={handleUserAction(handlePressBackspace)}
        keyboardLetterState={keyboardLetterState}
      />
    </div>
  )
}

export default App
