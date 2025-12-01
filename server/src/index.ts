import express, { Request, Response } from "express";
import cors from "cors";
import { DocumentStore, IDocumentSession } from "ravendb";

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();



// ---------------- RavenDB SETUP ----------------
// keep your current hard-coded defaults:
const DEFAULT_URL = "https://a.free.playerproxy.ravendb.cloud";
const DEFAULT_DB  = "PlayerProxy";

// prefer env values, fall back to your current constants
const url = process.env.RAVENDB_URL || DEFAULT_URL;
const db  = process.env.RAVENDB_DB  || DEFAULT_DB;

const store = new DocumentStore([url], db);

// If a client certificate is provided, use it (RavenDB Cloud requires this)
const certPath = process.env.RAVENDB_CERT_PFX;
const certPassword = process.env.RAVENDB_CERT_PASSWORD;

if (certPath && certPassword) {
  // Resolve relative to the project root so it works with ts-node and when built
  const absCertPath = path.resolve(process.cwd(), certPath);
  store.authOptions = {
    type: "pfx",
    certificate: fs.readFileSync(absCertPath),
    password: certPassword
  };
} else {
  console.warn("[RavenDB] No client certificate configured via env; Cloud will reject requests.");
}

store.initialize();

function openSession(): IDocumentSession {
  return store.openSession();
}



// TODO: change these to match your RavenDB Cloud setup
const RAVENDB_URLS = ["https://a.free.playerproxy.ravendb.cloud"]; // e.g. "https://a.b.c.cloud.ravendb.cloud"
const RAVENDB_DB = "PlayerProxy"; // e.g. "PlayerProxyDB"

// Create the DocumentStore once and reuse it
//const store = new DocumentStore(RAVENDB_URLS, RAVENDB_DB);

// If you need cert auth, we’ll add store.authOptions later.
// For now this is the basic shape.
store.initialize();

//function openSession(): IDocumentSession {
//  return store.openSession();
//}

// ---------------- EXPRESS APP ----------------

const app = express();

// parse JSON bodies
app.use(express.json());

// allow your Vite dev server to call this API
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default dev URL
  })
);

// simple health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});
//api test
app.get("/api/test", (_req, res) => {
  res.json({ message: "TESTING THIS PRINTS AS A JSON ON BROWSER" });
});

// /api/player?id=players/john-smith
app.get("/api/players", async (req, res) => {
  const id = String(req.query.id || "");
  if (!id) return res.status(400).json({ error: "Missing id" });

  const session = openSession();
  try {
    const doc = await session.load(id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (e: any) {
  console.error("LOAD ERROR:", e);  // This logs the full error object
  res.status(500).json({
    error: "Failed to fetch player",
    detail: e.message || e});
  } finally {
    session.dispose();
  }
});

// GET /api/players — return all player documents
app.get("/api/allplayers", async (_req, res) => {
  const session = openSession();

  try {
    // Query all docs from the "Players" collection (case-sensitive!)
    const players = await session.query({ collection: "Players" }).all();

    if (!players.length) {
      return res.status(404).json({ message: "No players found" });
    }

    res.json(players);
  } catch (e: any) {
    console.error("QUERY ERROR:", e);
    res.status(500).json({
      error: "Failed to query players",
      detail: e.message || e
    });
  } finally {
    session.dispose();
  }
});



// GET /api/playerstats/:playerId - return all game stats for a player
app.get("/api/playerstats/:playerId", async (req, res) => {
  const session = openSession();
  
  try {
    const { playerId } = req.params;
    
    // Query all GameStats for this player
    const stats = await session
      .query({ collection: "GameStats" })
      .whereEquals("playerId", playerId)
      .all();

    res.json(stats);
  } catch (e: any) {
    console.error("STATS QUERY ERROR:", e);
    res.status(500).json({
      error: "Failed to fetch player stats",
      detail: e.message || e
    });
  } finally {
    session.dispose();
  }
});
//queries below this line --------------------------------------


// Debug endpoint to check GameStats collection
app.get("/api/debug/gamestats", async (_req, res) => {
  const session = openSession();
  
  try {
    // Get all GameStats documents to see what's in the collection
    const allGameStats = await session
      .query({ collection: "GameStats" })
      .all();
    
    console.log("All GameStats documents:", allGameStats);
    
    res.json({
      count: allGameStats.length,
      documents: allGameStats
    });
  } catch (e: any) {
    console.error("DEBUG ERROR:", e);
    res.status(500).json({
      error: "Debug query failed",
      detail: e.message || e
    });
  } finally {
    session.dispose();
  }
});

// PUT /api/update-player/:id - update player document
app.put("/api/update-player/:id", async (req, res) => {
  const session = openSession();
  
  try {
    const { id } = req.params;
    const updates = req.body as Record<string, any>; // Type the updates

    console.log("Updating player ID:", id);
    console.log("Updates:", updates);
    
    // Load existing player
    const player = await session.load(id);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    
    // Apply updates (excluding @metadata and id)
    Object.keys(updates).forEach(key => {
      if (key !== '@metadata' && key !== 'id') {
        (player as Record<string, any>)[key] = updates[key];
      }
    });
    
    await session.saveChanges();
    
    res.json({ 
      success: true, 
      message: "Player updated successfully",
      player 
    });
  } catch (e: any) {
    console.error("UPDATE ERROR:", e);
    res.status(500).json({
      error: "Failed to update player",
      detail: e.message || e
    });
  } finally {
    session.dispose();
  }
});

// POST /api/create-gamestats - create new game stats document
app.post("/api/create-gamestats", async (req, res) => {
  const session = openSession();
  
  try {
    const gameStats = req.body;
    
    // Generate a unique ID
    const id = `gamestats/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Add the ID to the document
    gameStats.id = id;
    
    await session.store(gameStats, id);
    await session.saveChanges();
    
    res.json({ 
      success: true, 
      id: id,
      message: "Game stats recorded successfully" 
    });
  } catch (e: any) {
    console.error("CREATE GAMESTATS ERROR:", e);
    res.status(500).json({
      error: "Failed to save game stats",
      detail: e.message || e
    });
  } finally {
    session.dispose();
  }
});


// ---------------- START SERVER ----------------

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
