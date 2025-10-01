import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import dotenv from 'dotenv'

import path from 'path'
import { fileURLToPath } from 'url'

// --- Load environment variables ---
dotenv.config()

// --- Initialize Express ---
const app = express()
const port = process.env.PORT || 5000
const apiUrl = process.env.VITE_API_CLUB_URL
const myInt = process.env.VITE_MY_INT

// --- Resolve __dirname for ES modules ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// --- Serve frontend build ---
const distPath = path.join(__dirname, 'dist')
app.use(express.static(distPath))

// --- Enable CORS ---
app.use(cors())

// --- Default headers for EA API ---
const defaultHeaders = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
  Connection: 'keep-alive',
}

// --- Helper: fetch with retries ---
async function fetchWithRetries(url, options = {}, opts = {}) {
  const {
    retries = 3, // montako yritystä yhteensä
    retryOn = [429, 502, 503, 504], // tilakoodit joita yritämme uudelleen
    backoffBaseMs = 500, // alkuperäinen viive (ms)
    logger = console, // voi korvata omalla loggerilla
  } = opts

  let attempt = 0
  let lastError = null

  while (attempt < retries) {
    attempt++
    try {
      logger.log(`Attempt ${attempt}/${retries} -> ${url}`)
      const response = await fetch(url, options)

      // Jos OK, palautetaan JSON (tai tyhjä jos ei JSON)
      if (response.ok) {
        const text = await response.text()
        try {
          return {
            ok: true,
            status: response.status,
            data: text ? JSON.parse(text) : null,
          }
        } catch (e) {
          // jos ei JSON, palauta tekstinä
          return { ok: true, status: response.status, data: text }
        }
      }

      // Jos status on sellainen, jota kannattaa yrittää uudelleen -> delay ja loop
      if (retryOn.includes(response.status) && attempt < retries) {
        logger.warn(`Non-ok status ${response.status}. Retrying...`)
        const delay = backoffBaseMs * Math.pow(2, attempt - 1)
        await new Promise((r) => setTimeout(r, delay))
        continue
      }

      // Ei ok ja ei kannata yrittää uudestaan -> lue raakateksti ja palauta virheenä
      const text = await response.text()
      logger.error(
        `Final response (no retry): status=${response.status} body=${text}`
      )
      return { ok: false, status: response.status, raw: text }
    } catch (err) {
      // verkko- tai fetch-virhe (esim. timeout) -> yritä uudelleen
      lastError = err
      logger.error(`Fetch error on attempt ${attempt}:`, err)
      if (attempt < retries) {
        const delay = backoffBaseMs * Math.pow(2, attempt - 1)
        await new Promise((r) => setTimeout(r, delay))
        continue
      }
      // maxyritykset käytetty
      logger.error(`Max retries reached (${retries}). Last error:`, lastError)
      return { ok: false, status: 500, raw: String(lastError) }
    }
  }

  // jos loop päättyi jotenkin (ei pitäisi)
  return { ok: false, status: 500, raw: 'Unknown fetch error' }
}

// --- API ROUTES ---

fetch('https://api.ipify.org?format=json')
  .then((r) => r.json())
  .then((ip) => console.log('Public IP from Render:', ip))

// GET club info
app.get('/club', async (req, res) => {
  try {
    const url = `${apiUrl}/clubs/info?platform=common-gen5&clubIds=${myInt}`
    console.log('Fetching EA API:', url)

    const result = await fetchWithRetries(
      url,
      { headers: defaultHeaders },
      { retries: 3 }
    )

    if (!result.ok) {
      return res.status(result.status === 500 ? 502 : result.status).json({
        error: `EA API error ${result.status}`,
        raw: result.raw,
        attempts: 3,
      })
    }

    // result.data sisältää jo JSON-objektin
    res.json(result.data)
  } catch (err) {
    console.error('Backend error:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET matches dynamically
app.get('/matches/:id', async (req, res) => {
  try {
    const { id } = req.params
    const matchType = req.query.matchType || 'gameType5'

    const url = `${apiUrl}/clubs/matches?matchType=${matchType}&platform=common-gen5&clubIds=${id}`
    console.log('Fetching EA API:', url)

    const result = await fetchWithRetries(
      url,
      { headers: defaultHeaders },
      { retries: 3 }
    )

    if (!result.ok) {
      return res.status(result.status === 500 ? 502 : result.status).json({
        error: `EA API error ${result.status}`,
        raw: result.raw,
        attempts: 3,
      })
    }

    res.json(result.data)
  } catch (err) {
    console.error('Backend error:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET club search
app.get('/clubsearch/:name', async (req, res) => {
  try {
    const { name } = req.params

    const url = `${apiUrl}/clubs/search?platform=common-gen5&clubName=${encodeURIComponent(name)}`
    console.log('Search parameter:', name, 'address:', url)

    const result = await fetchWithRetries(
      url,
      { headers: defaultHeaders },
      { retries: 3 }
    )

    if (!result.ok) {
      return res.status(result.status === 500 ? 502 : result.status).json({
        error: `EA API error ${result.status}`,
        raw: result.raw,
        attempts: 3,
      })
    }

    const results = Object.entries(result.data).map(([clubId, clubData]) => ({
      clubId,
      ...clubData,
    }))

    console.log('Number of clubs found:', results.length)

    res.json({
      count: results.length,
      results,
    })
  } catch (err) {
    console.error('Backend error:', err)
    res.status(500).json({ error: err.message })
  }
})

app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Proxy backend running on http://localhost:${port}`)
})
