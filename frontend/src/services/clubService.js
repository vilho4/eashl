const myInt = import.meta.env.VITE_MY_INT

const baseUrl =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_DEV_BASE_URL
    : import.meta.env.VITE_PROD_BASE_URL

export async function getMatches(id = myInt, matchType = 'gameType5') {
  const url = `${baseUrl}/matches/${id}?matchType=${matchType}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('getMatches failed: ' + res.status)
  return res.json()
}

export const fetchClubs = async (name) => {
  const url = `${baseUrl}/clubsearch/${encodeURIComponent(name)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch clubs')
  return res.json()
}
