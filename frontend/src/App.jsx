import Matches from './components/Matches'

const App = () => {
  const myClubId = 40702 // tai import.meta.env.VITE_MY_INT

  return (
    <div>
      <h1>Keupa Esports</h1>
      <Matches clubId={myClubId} />
    </div>
  )
}

export default App
