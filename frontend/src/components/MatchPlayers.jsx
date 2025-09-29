export default function MatchPlayers({ match, myClubId }) {
  if (!match || !match.players) return null

  const playerData = match.players[myClubId]
  if (!playerData) return null

  const players = Object.values(playerData)

  function formatSecondsToMMSS(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="players-table-container">
      <table className="players-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Player Level</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>+/-</th>
            <th>Shots</th>
            <th>Shot Attempts</th>
            <th>Shot %</th>
            <th>Shots on Goal %</th>
            <th>Passes</th>
            <th>Pass Attempts</th>
            <th>Pass %</th>
            <th>Saucer Passes</th>
            <th>Giveaways</th>
            <th>Takeaways</th>
            <th>Interceptions</th>
            <th>Hits</th>
            <th>Blocks</th>
            <th>Posession</th>
            <th>Rating Offense</th>
            <th>Rating Defense</th>
            <th>Rating Teamplay</th>
            <th>Rank Points</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.playername}>
              <td>{p.playername}</td>
              <td>{p.position}</td>
              <td>{p.playerLevel}</td>
              <td>{p.skgoals}</td>
              <td>{p.skassists}</td>
              <td>{p.skplusmin}</td>
              <td>{p.skshots}</td>
              <td>{p.skshotattempts}</td>
              <td>{p.skshotpct}</td>
              <td>{p.skshotonnetpct}</td>
              <td>{p.skpasses}</td>
              <td>{p.skpassattempts}</td>
              <td>{p.skpasspct}</td>
              <td>{p.sksaucerpasses}</td>
              <td>{p.skgiveaways}</td>
              <td>{p.sktakeaways}</td>
              <td>{p.skinterceptions}</td>
              <td>{p.skhits}</td>
              <td>{p.skbs}</td>
              <td>{formatSecondsToMMSS(p.skpossession)}</td>
              {/* <td>{p.skpossession}</td> */}
              <td>{p.ratingOffense}</td>
              <td>{p.ratingDefense}</td>
              <td>{p.ratingTeamplay}</td>
              <td>{p.rankpoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
