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


//queries below this line --------------------------------------





// ---------------- START SERVER ----------------

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
