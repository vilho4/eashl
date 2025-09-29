import { useQuery } from '@tanstack/react-query'
import { getMatches } from '../services/clubService'
import React from 'react'
import MatchPlayers from './MatchPlayers'
import { useParams } from 'react-router-dom'

export default function Matches({ clubId: propClubId }) {
  const params = useParams()
  const clubId = params.id || propClubId
  // console.log(clubId, 'tämä on clubid')
  // console.log(params.id, 'paramsid')
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

  // console.log(Object.keys(matches[0].clubs), 'matches-komponentti')

  // const clubIds = Object.keys(matches[0].clubs)

  // console.log(clubIds[0])
  // console.log(clubIds[1])

  // const myClubId = clubId

  return (
    <div className="matches-container">
      <h2>Ottelut</h2>
      {matches.map((m) => {
        const joukkueID = Object.keys(m.clubs)
        const clubData = m.clubs[joukkueID[0]]
        const details = clubData?.details
        const opponentId = joukkueID[1]
        const opponentData = m.clubs[opponentId]
        const opponentDetails = opponentData?.details

        // console.log(details.name)
        // console.log(opponentDetails.name)
        // console.log(opponentDetails.clubId, 'vastustaja')

        return (
          <div key={m.matchId} className="match-card">
            <p>
              <strong>ID:</strong> {m.matchId}
            </p>
            <p>
              <strong>Aika:</strong>{' '}
              {new Date(m.timestamp * 1000).toLocaleString('fi-FI')}
            </p>
            <p>
              <strong>Kotijoukkue:</strong> {details?.name ?? 'N/A'}{' '}
              <strong>Vierasjoukkue:</strong> {opponentDetails?.name ?? 'N/A'}
            </p>
            <p>
              <strong>Koti ID:</strong> {details?.clubId ?? 'N/A'}{' '}
              <strong>Vieras ID:</strong> {opponentDetails?.clubId ?? 'N/A'}
            </p>
            <p>
              <strong>Lopputulos(koti-vieras?):</strong>{' '}
              {clubData?.scoreString ?? 'N/A'}
            </p>
            <p>
              <strong>GF - GA:</strong> {clubData?.gfraw ?? 'N/A'}-
              {clubData?.garaw ?? 'N/A'}
            </p>

            {/* Pelaajien tilastot */}
            <h3>{details?.name ?? 'N/A'}</h3>
            <MatchPlayers match={m} myClubId={joukkueID[0]} />
            <h3>{opponentDetails?.name ?? 'N/A'}</h3>
            <MatchPlayers match={m} myClubId={joukkueID[1]} />
          </div>
        )
      })}
    </div>
  )
}
