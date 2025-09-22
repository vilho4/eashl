import { useQuery } from '@tanstack/react-query'
import { getMatches } from '../services/clubService'
import React from 'react'
import MatchPlayers from './MatchPlayers'

export default function Matches({ clubId }) {
  const {
    data: matches,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['matches', clubId],
    queryFn: () => getMatches(clubId),
    retry: 3,
  })

  if (isLoading) return <p>Ladataan ottelut...</p>
  if (isError) return <p>Virhe: {error.message}</p>
  if (!matches || matches.length === 0) return <p>Ei otteluita.</p>

  const myClubId = 40702

  return (
    <div className="matches-container">
      <h2>Ottelut</h2>
      {matches.map((m) => {
        const clubData = m.clubs[myClubId]
        const details = clubData?.details

        // Etsi vastustajan ID (se joka ei ole oma clubId)
        const opponentId = Object.keys(m.clubs).find(
          (id) => id !== String(myClubId)
        )
        const opponentData = m.clubs[opponentId]
        const opponentDetails = opponentData?.details

        return (
          <div key={m.matchId} className="match-card">
            <p>
              <strong>ID:</strong> {m.matchId}
            </p>
            <p>
              <strong>Seura:</strong> {details?.name ?? 'N/A'}
            </p>
            <p>
              <strong>Seura ID:</strong> {details?.clubId ?? 'N/A'}
            </p>
            <p>
              <strong>Lopputulos:</strong> {clubData?.scoreString ?? 'N/A'}
            </p>

            {/* Pelaajien tilastot */}
            <MatchPlayers match={m} myClubId={myClubId} />
          </div>
        )
      })}
    </div>
  )
}
