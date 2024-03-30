
interface fetchRandomWordsArgs {
  number: number;
  length: 5;
}
export async function fetchRandomWords({ number, length }: fetchRandomWordsArgs) {
  const response = await fetch(
    `https://random-word-api.herokuapp.com/word?number=${number}&length=${length}`
  )
  const results: string[] = await response.json()
  return results.map(word => word.toUpperCase())
}
