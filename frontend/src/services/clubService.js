const myInt = import.meta.env.VITE_MY_INT

const baseUrl =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_DEV_BASE_URL
    : import.meta.env.VITE_PROD_BASE_URL

// Fetch matches for a club
export async function getMatches(id = myInt, matchType = 'gameType5') {
  const url = `${baseUrl}/matches/${id}?matchType=${matchType}`
  // console.log('Fetching matches from:', url)
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    console.error('getMatches failed, response:', text)
    throw new Error('getMatches failed: ' + res.status)
  }
  return res.json()
}

// Search clubs by name
export const fetchClubs = async (name) => {
  const url = `${baseUrl}/clubsearch/${encodeURIComponent(name)}`
  // console.log('Fetching clubs from:', url)
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    console.error('fetchClubs failed, response:', text)
    throw new Error('Failed to fetch clubs: ' + res.status)
  }
  return res.json()
}
