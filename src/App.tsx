import { useEffect, useRef, useState } from 'react'

import { WordleKeyboard } from './WordleKeyboard'
import { WordleBoard } from './WordleBoard'

import {
  WordleLetter,
  LetterState,
  WordleBoard as WordleBoardType,
  WordleLetterPosition,
  WordleRow
} from './types'
import {
  ALPHABET,
  DEFAULT_LETTER_OBJ,
  NUM_ROWS,
  WORDS,
  WORD_LENGTH
} from './constants'

import './App.css'
import { fetchRandomWord } from './api'
import { delay } from './util'

function App() {
  const [wordleBoard, setWordleBoard] = useState<WordleBoardType>(
    Array.from({ length: NUM_ROWS }).map(() =>
      Array.from({ length: WORD_LENGTH }).map(() => ({
        letter: '',
        state: LetterState.DEFAULT
      }))
    )
  )

  const [nextLetterSpot, setNextLetterSpot] = useState<WordleLetterPosition>({
    row: 0,
    position: 0
  })

  const [keyboardLetterState, setKeyboardLetterState] = useState<Record<string, LetterState>>(
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
      return words?.[0]
    } catch (err) {
      console.error(err)
      return null
    }
  }

  function handlePressLetter(letter: string) {
    if (gameOver) return

    const { row, position } = nextLetterSpot

    if (position < WORD_LENGTH) {
      setWordleBoard(prev => {
        const newBoard = structuredClone(prev)
        newBoard[row][position] = {
          letter,
          state: LetterState.DEFAULT
        }
        return newBoard
      })
    
      setNextLetterSpot(prev => ({
        ...prev,
        position: prev.position + 1
      }))
    }
  }

  async function handlePressEnter() {
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

  function handlePressBackspace() {
    if (gameOver) return

    const { row, position } = nextLetterSpot

    if (position > 0) {
      setWordleBoard(prev => {
        const newBoard = structuredClone(prev)
        newBoard[row][position - 1] = DEFAULT_LETTER_OBJ
        return newBoard
      })
    
      setNextLetterSpot(prev => ({
        ...prev,
        position: prev.position - 1
      }))
    }
  }
  
  async function setLetterStateDelayed(
    letterObj: WordleLetter,
    letterPos: WordleLetterPosition,
    delayMs = 300
  ) {
    await delay(letterPos.position * delayMs)

    setWordleBoard(prev => {
      const newBoard = structuredClone(prev)
      newBoard[letterPos.row][letterPos.position] = letterObj
      return newBoard
    })
  }

  async function evaluateBoardRowLetters(rowNum: number) {
    const goalWordCharCount = goalWord.current.split('').reduce((acc, curr) => {
      acc[curr] === undefined ? acc[curr] = 1 : acc[curr] += 1
      return acc
    }, {} as Record<string, number>)

    const row: WordleRow = structuredClone(wordleBoard[rowNum])

    row.forEach((letterObj, i) => {
      if (goalWord.current[i] === letterObj.letter) {
        goalWordCharCount[letterObj.letter] -= 1
        row[i] = {
          ...letterObj,
          state: LetterState.CORRECT
        }
      }
    })

    row.forEach((letterObj, i) => {
      if (goalWordCharCount[letterObj.letter] > 0) {
        goalWordCharCount[letterObj.letter] -= 1
        row[i] = {
          ...letterObj,
          state: LetterState.PRESENT
        }
      }
    })

    row.forEach((letterObj, i) => {
      if (letterObj.state === LetterState.DEFAULT) {
        row[i] = {
          ...letterObj,
          state: LetterState.ABSENT
        }
      }
    })

    const promises = row.map(async (letterObj, i) => {
      return setLetterStateDelayed(
        letterObj,
        { row: rowNum, position: i }
      )
    })

    await Promise.all(promises)
    return row
  }

  async function evaluateRow(rowNum: number) {
    const newRow = await evaluateBoardRowLetters(rowNum)

    setKeyboardLetterState(prev => {
      const newState = structuredClone(prev)
      newRow.forEach(letterObj => {
        if (letterObj.state > newState[letterObj.letter]) {
          newState[letterObj.letter] = letterObj.state
        }
      })
      return newState
    })

    determineEndOfGame(rowNum, newRow)
  }

  function determineEndOfGame(rowNum: number, row: WordleRow) {
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
