import { KeyType, LetterState, T_WordleLetter } from "./types"

const WORDS = Object.freeze([
  'APPLE',
  'BEAST',
  'FAINT',
  'FEAST',
  'FRUIT',
  'GAMES',
  'PAINT',
  'PASTE',
  'TOWER',
  'REACT',
  'blade',
  'brown',
  'obese',
  'knife',
  'short',
  'drill',
  'entry',
  'tempt',
  'cover',
  'steam',
  'stool',
  'pluck',
  'exile',
  'youth',
  'taste',
  'berry',
  'visit',
  'laser',
  'guilt',
  'doubt',
  'month',
  'aloof',
  'brink',
  'cruel',
  'flood',
  'eagle',
  'troop',
  'award',
  'obese',
  'chalk',
  'plane',
  'slump',
  'spine',
  'steel',
  'disco',
  'beach',
  'reign',
  'salon',
  'pitch',
  'agony',
  'amuse',
  'river',
  'queue',
  'title',
  'lemon',
  'wreck',
  'write',
  'sport',
  'lover',
  'paint',
  'fruit',
  'belly',
  'drama',
  'feast',
  'place',
  'faith',
  'large',
  'chain',
  'bland',
  'basic',
  'knife',
  'haunt',
  'ridge',
  'tower',
  'cheap',
  'wheel',
  'bacon',
  'spill',
  'bring',
  'aisle',
  'craft',
  'first',
  'cover'
].map(word => word.toUpperCase()))

const A_CHAR_CODE = 65
const Z_CHAR_CODE = 90

const ALPHABET: string[] = []
for (let i = A_CHAR_CODE; i <= Z_CHAR_CODE; i++) {
  ALPHABET.push(String.fromCharCode(i))
}

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  [KeyType.ENTER, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', KeyType.BACKSPACE]
]

const DEFAULT_LETTER_OBJ: T_WordleLetter = {
  letter: '',
  state: LetterState.DEFAULT
}

const NUM_ROWS = 6
const WORD_LENGTH = 5

export {
  ALPHABET,
  DEFAULT_LETTER_OBJ,
  NUM_ROWS,
  KEYBOARD_LAYOUT,
  WORD_LENGTH,
  WORDS
}
