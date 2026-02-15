import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
// import Route
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

config();
connectDB();
const app = express();

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Listening on PORT:${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err}`);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", async (err) => {
  console.error(`Uncaught Exception: ${err}`);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await disconnectDB();
  process.exit(0);
});
