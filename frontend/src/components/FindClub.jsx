import { useState, useEffect } from 'react'

const FindClub = ({ onSearch }) => {
  const [term, setTerm] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (term.trim().length < 3) {
      setError('Please enter at least 3 characters')
      return
    }
    setError('')
    onSearch(term)
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Type in club name"
      />
      <button type="submit">Search</button>

      {error && <p className="errornotification">{error}</p>}
    </form>
  )
}

export default FindClub
