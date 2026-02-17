import express from "express";
import {
  addToWatchlist,
  deleteFromWatchlist,
  getAllWatchlistItems,
  updateWatchlistItem,
} from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequestMiddleware } from "../middleware/validateRequestMiddleware.js";
import {
  addToWatchlistSchema,
  updateWatchlistSchema,
} from "../validators/watchlistValidators.js";

const router = express.Router();

router.use(authMiddleware); // Protect all routes in this router

router.post(
  "/",
  validateRequestMiddleware(addToWatchlistSchema),
  addToWatchlist,
);
router.put(
  "/:id",
  validateRequestMiddleware(updateWatchlistSchema),
  updateWatchlistItem,
); // For updating status, rating, notes
router.delete("/:id", deleteFromWatchlist);
router.get("/", getAllWatchlistItems); // Optional: Get all watchlist items for the authenticated user

export default router;
