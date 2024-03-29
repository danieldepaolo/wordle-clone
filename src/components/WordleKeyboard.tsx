import { KEYBOARD_LAYOUT } from "../constants"
import { KeyType, KeyboardKey, LetterState } from "../types"
import { getKeyboardLetterClass } from "../util"

export interface WordleKeyboardKeyProps {
  keyboardKey: KeyboardKey
  letterState: LetterState
  onPressKey: (key: KeyboardKey) => void
}

export const WordleKeyboardKey = ({
  keyboardKey,
  letterState,
  onPressKey
}: WordleKeyboardKeyProps) => {
  const isSpecialKey =
    keyboardKey === KeyType.ENTER ||
    keyboardKey === KeyType.BACKSPACE

  const isEvaluatedLetter =
    !isSpecialKey && letterState !== LetterState.DEFAULT

  return (
    <div
      className={[
          'wordle-letter',
          'keyboard-key',
          isSpecialKey && 'special-key',
          getKeyboardLetterClass(letterState),
          isEvaluatedLetter && 'letter-evaluated'
        ]
        .filter(Boolean)
        .join(' ')
      }
      onClick={() => onPressKey(keyboardKey)}
    >
      {keyboardKey}
    </div>
  )
}

export interface WordleKeyboardProps {
  onPressEnter: () => void
  onPressLetter: (key: KeyboardKey) => void
  onPressBackspace: () => void
  keyboardLetterState: Record<KeyboardKey, LetterState>
}

export const WordleKeyboard = ({
  onPressLetter,
  onPressEnter,
  onPressBackspace,
  keyboardLetterState
}: WordleKeyboardProps) => {
  function onPressKey(key: string) {
    if (key === KeyType.ENTER) {
      onPressEnter()
    } else if (key === KeyType.BACKSPACE) {
      onPressBackspace()
    } else {
      onPressLetter(key)
    }
  }

  return (
    <div className='keyboard'>
      {KEYBOARD_LAYOUT.map((row: KeyboardKey[]) => {
        return (
          <div key={row.join('-')} className='keyboard-row'>
            {row.map((keyboardKey: KeyboardKey) => (
              <WordleKeyboardKey
                key={keyboardKey}
                keyboardKey={keyboardKey}
                letterState={keyboardLetterState[keyboardKey]}
                onPressKey={onPressKey}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
