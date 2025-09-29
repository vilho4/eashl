import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './Pages/Home'
import SearchClub from './Pages/SearchClub'
import Matches from './components/Matches'

const App = () => {
  const myClubId = import.meta.env.VITE_MY_INT

  return (
    <Router>
      <header>
        <nav>
          <Link to="/">Home</Link> | <Link to="/searchclub">Search Clubs</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home clubId={myClubId} />} />
        <Route path="/searchclub" element={<SearchClub />} />
        <Route path="/club/:id" element={<Matches />} />
      </Routes>
    </Router>
  )
}

export default App
