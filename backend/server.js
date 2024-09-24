import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express(); // Initialize app before using it
app.use(cors());
app.use(express.json());

// Database connection setup (if needed)
const dbConnectionString = process.env.db_url; // Assuming you still want to connect to PostgreSQL if needed
export const db = new pg.Pool({
  connectionString: dbConnectionString,
});

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Endpoint to get posts for a specific subject
app.get("/api/posts/:subject", async (req, res) => {
  const { subject } = req.params;
  const { data, error } = await supabase.from(subject).select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Endpoint to create a new post
app.post("/api/posts/:subject", async (req, res) => {
  const { subject } = req.params;
  const { content } = req.body;

  const { data, error } = await supabase.from(subject).insert([{ content }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// Endpoint to like a post
app.post("/api/posts/:subject/:id/like", async (req, res) => {
  const { subject, id } = req.params;
  const { data, error } = await supabase
    .from(subject)
    .update({ likes: supabase.raw("likes + 1") })
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Endpoint to delete a post
app.delete("/api/posts/:subject/:id", async (req, res) => {
  const { subject, id } = req.params;
  const { data, error } = await supabase.from(subject).delete().eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
