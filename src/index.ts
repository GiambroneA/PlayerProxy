// src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { DocumentStore, IDocumentSession } from "ravendb";

// ---------------- RavenDB SETUP ----------------

// For now, hardcode values so it's easy to see.
// Later you can move them to environment variables.
const RAVENDB_URLS = ["https://a.free.playerproxy.ravendb.cloud"]; // playerproxy url
const RAVENDB_DB = "PlayerProxy"; // <-- database name

// Create the DocumentStore (global, reused across requests)
const store = new DocumentStore(RAVENDB_URLS, RAVENDB_DB);
// If you're using certificate auth, you would configure store.authOptions here
store.initialize();

// Helper to open a session
function openSession(): IDocumentSession {
  return store.openSession();
}

// ---------------- EXPRESS APP SETUP ----------------

const app = express();

// Allow JSON bodies
app.use(express.json());

// Enable CORS so your Vite frontend (localhost:5173) can call this API
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default dev URL
  })
);

// ---------------- ROUTES ----------------

// Simple health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Example: GET /api/items → read from RavenDB
app.get("/api/items", async (_req: Request, res: Response) => {
  const session = openSession();
  try {
    // Query all documents from the Items collection
    const items = await session.query<any>({ collection: "Items" }).all();
    res.json(items);
  } catch (error) {
    console.error("Error in GET /api/items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  } finally {
    session.dispose();
  }
});

// Example: POST /api/items → create a new document
app.post("/api/items", async (req: Request, res: Response) => {
  const session = openSession();
  try {
    const newItem = req.body; // e.g. { name: "Test item" }
    await session.store(newItem);
    await session.saveChanges();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error in POST /api/items:", error);
    res.status(500).json({ error: "Failed to create item" });
  } finally {
    session.dispose();
  }
});

// ---------------- START SERVER ----------------

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
