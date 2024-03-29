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
import { fetchRandomWord } from './api'
import { delay } from './util'

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

  const goalWord = useRef(WORDS[(Math.floor(Math.random() * WORDS.length))])
  const gameOver = !!gameEndMsg

  useEffect(() => {
    determineGoalWord().then(word => {
      if (word !== null) {
        goalWord.current = word
      }
    })
  }, [])

  async function determineGoalWord(): Promise<string | null> {
    try {
      const words = await fetchRandomWord()
      return words?.[0] || null
    } catch (err) {
      console.error(err)
      return null
    }
  }

  function handlePressLetter(letter: string): void {
    if (gameOver) return

    const { row, position } = nextLetterSpot

    if (position < WORD_LENGTH) {
      setWordleBoard(prev => {
        const newBoard = structuredClone(prev)
        newBoard[row][position] = {
          letter,
          state: LetterState.DEFAULT,
          ...nextLetterSpot,
        }
        return newBoard
      })

      setNextLetterSpot(prev => ({
        ...prev,
        position: prev.position + 1
      }))
    }
  }

  async function handlePressEnter(): Promise<void> {
    if (gameOver) return

    if (nextLetterSpot.position === WORD_LENGTH) {
      await evaluateRow(nextLetterSpot.row)

      if (!gameOver) {
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
    if (gameOver) return

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

  async function evaluateBoardRowLetters(rowNum: number): Promise<T_WordleRow> {
    const goalWordCharCount = goalWord.current.split('').reduce((acc, curr) => {
      acc[curr] === undefined ? acc[curr] = 1 : acc[curr] += 1
      return acc
    }, {} as Record<string, number>)

    const row: T_WordleRow = structuredClone(wordleBoard[rowNum])

    row.forEach((boardLetter: T_WorldBoardLetter) => {
      const { position, letter } = boardLetter

      if (goalWord.current[position] === letter) {
        goalWordCharCount[letter] -= 1
        row[position] = {
          ...boardLetter,
          state: LetterState.CORRECT
        }
      }
    })

    row.forEach((boardLetter: T_WorldBoardLetter) => {
      const { position, letter } = boardLetter

      if (goalWordCharCount[letter] > 0) {
        goalWordCharCount[letter] -= 1
        row[position] = {
          ...boardLetter,
          state: LetterState.PRESENT
        }
      }
    })

    row.forEach((boardLetter: T_WorldBoardLetter) => {
      const { state, position } = boardLetter

      if (state === LetterState.DEFAULT) {
        row[position] = {
          ...boardLetter,
          state: LetterState.ABSENT
        }
      }
    })

    const promises = row.map((boardLetter) => setLetterStateDelayed(boardLetter))
    await Promise.all(promises)

    return row
  }

  async function evaluateRow(rowNum: number): Promise<void> {
    const newRow = await evaluateBoardRowLetters(rowNum)

    setKeyboardLetterState(prev => {
      const newState = structuredClone(prev)
      newRow.forEach(({ state, letter }) => {
        if (state > newState[letter]) {
          newState[letter] = state
        }
      })
      return newState
    })

    determineEndOfGame(rowNum, newRow)
  }

  function determineEndOfGame(rowNum: number, row: T_WordleRow): void {
    const isWin = row.every(({ state }) =>
      state === LetterState.CORRECT
    )
    const usedAllGuesses = rowNum === NUM_ROWS - 1

    if (isWin) {
      setGameEndMsg('You have won!')
    } else if (usedAllGuesses) {
      setGameEndMsg('You lost. Better luck next time.')
    }
  }

  return (
    <div className='app'>
      <div className='app-header'>
        Wordle Clone
      </div>
      <WordleBoard
        boardState={wordleBoard}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
        gameEndMsg={gameEndMsg}
      />
      <WordleKeyboard
        onPressLetter={handlePressLetter}
        onPressEnter={handlePressEnter}
        onPressBackspace={handlePressBackspace}
        keyboardLetterState={keyboardLetterState}
      />
    </div>
  )
}

export default App
