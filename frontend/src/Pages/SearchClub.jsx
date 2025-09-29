import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import FindClub from '../components/FindClub'
import { fetchClubs } from '../services/clubService'
import { Link } from 'react-router-dom'

const SearchClub = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['clubs', searchTerm],
    queryFn: () => fetchClubs(searchTerm),
    enabled: !!searchTerm, // hakee vain kun searchTerm ei ole tyhjä
  })

  const handleSearch = (term) => setSearchTerm(term)

  //   console.log(data)

  return (
    <div>
      <h1>Search Clubs</h1>
      <FindClub onSearch={handleSearch} />

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching clubs</p>}
      {!isLoading && !isError && data?.count === 0 && <p>No clubs found</p>}

      <div className="clubs-list">
        {data?.results?.map((club) => (
          <div key={club.clubId} className="club-card">
            <Link to={`/club/${club.clubId}`} className="club-name">
              {club.name}
            </Link>
            <table className="club-table">
              <thead>
                <tr>
                  <th>Record</th>
                  <th>Seasons</th>
                  <th>Current Division</th>
                  <th>Platform</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{club.record}</td>
                  <td>{club.seasons}</td>
                  <td>{club.currentDivision}</td>
                  <td>{club.platform}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchClub
