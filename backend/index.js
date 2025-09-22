import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

// --- Load environment variables ---
dotenv.config();

// --- Initialize Express ---
const app = express();
const port = process.env.PORT || 5000;
const apiUrl = process.env.VITE_API_CLUB_URL;
const myInt = process.env.VITE_MY_INT;

// --- Resolve __dirname for ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Serve frontend build ---
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// --- Enable CORS ---
app.use(cors());

// --- Default headers for EA API ---
const defaultHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  Connection: "keep-alive",
};

// --- API ROUTES ---

// GET club info
app.get("/club", async (req, res) => {
  try {
    const url = `${apiUrl}/clubs/info?platform=common-gen5&clubIds=${myInt}`;
    console.log("Fetching EA API:", url);

    const response = await fetch(url, { headers: defaultHeaders });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET matches dynamically
app.get("/matches/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const matchType = req.query.matchType || "gameType5";

    const url = `${apiUrl}/clubs/matches?matchType=${matchType}&platform=common-gen5&clubIds=${id}`;
    console.log("Fetching EA API:", url);

    const response = await fetch(url, { headers: defaultHeaders });
    if (!response.ok) {
      throw new Error(`EA API error ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Wildcard route to serve React app ---
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// --- Start server ---
app.listen(port, () => {
  console.log(`Proxy backend running on http://localhost:${port}`);
});
