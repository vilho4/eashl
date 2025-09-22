export default function MatchPlayers({ match, myClubId }) {
  if (!match || !match.players) return null

  const playerData = match.players[myClubId]
  if (!playerData) return null

  const players = Object.values(playerData)

  return (
    <div className="players-table-container">
      <table className="players-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>Shots</th>
            <th>Passes</th>
            <th>Pass Attempts</th>
            <th>Pass %</th>
            <th>Saucer Passes</th>
            <th>Giveaways</th>
            <th>Takeaways</th>
            <th>Interceptions</th>
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
              <td>{p.skgoals}</td>
              <td>{p.skassists}</td>
              <td>{p.skshots}</td>
              <td>{p.skpasses}</td>
              <td>{p.skpassattempts}</td>
              <td>{p.skpasspct}</td>
              <td>{p.sksaucerpasses}</td>
              <td>{p.skgiveaways}</td>
              <td>{p.sktakeaways}</td>
              <td>{p.skinterceptions}</td>
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
