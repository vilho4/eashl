import Matches from '../components/Matches'

const Home = ({ clubId }) => {
  return (
    <div>
      <h1>Home</h1>
      <Matches clubId={clubId} />
    </div>
  )
}

export default Home
