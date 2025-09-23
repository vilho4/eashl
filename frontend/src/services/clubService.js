const myInt = import.meta.env.VITE_MY_INT

// Base URL riippuu ympäristöstä
const baseUrl =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000' // kehityksessä
    : '' // tuotannossa Renderissä sama domain

export async function getMatches(id = myInt, matchType = 'gameType5') {
  const url = `${baseUrl}/matches/${id}?matchType=${matchType}`
  console.log('Fetching:', url) // debug-lokitus
  const res = await fetch(url)
  if (!res.ok) throw new Error('getMatches failed: ' + res.status)
  return res.json()
}
