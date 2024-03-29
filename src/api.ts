export async function fetchRandomWord(number: number = 1, length: number = 5) {
  const response = await fetch(
    `https://random-word-api.herokuapp.com/word?number=${number}&length=${length}`
  )
  const results: string[] = await response.json()
  return results.map(word => word.toUpperCase())
}
