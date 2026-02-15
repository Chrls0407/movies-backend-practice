import { prisma } from "../config/db.js";

const getAllWatchlistItems = async (req, res) => {
  try {
    const watchlistItems = await prisma.watchlistItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        movie: true, // Include movie details for each watchlist item
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        watchlistItems,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching watchlist items", error });
  }
};

const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  // Check if the movie exists in the database
  const movie = await prisma.movie.findUnique({
    where: {
      id: movieId,
    },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  // Check if already added to watchlist
  const existingEntry = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId,
      },
    },
  });

  if (existingEntry) {
    return res.status(400).json({ error: "Movie already in watchlist" });
  }

  const watchlistEntry = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });
  res.status(201).json({
    status: "success",
    data: {
      watchlistEntry,
    },
  });
};

const updateWatchlistItem = async (req, res) => {
  const { id } = req.params;
  const { status, rating, notes } = req.body;

  try {
    const watchlistItem = await prisma.watchlistItem.findUnique({
      where: {
        id,
      },
    });

    if (watchlistItem.userId !== req.user.id) {
      return res.status(403).json({
        error: "Unauthorized: You can only update your own watchlist items",
      });
    }

    const updatedEntry = await prisma.watchlistItem.update({
      where: {
        id: id,
        userId: req.user.id, // Ensure the user can only update their own watchlist items
      },
      data: {
        status: status || watchlistItem.status,
        rating: rating || watchlistItem.rating,
        notes: notes || watchlistItem.notes,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        updatedEntry,
      },
    });
  } catch (error) {
    res
      .status(404)
      .json({ error: "Watchlist item not found or unauthorized", error });
  }
};

const deleteFromWatchlist = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the watchlist item exists and belongs to the user
    const watchlistItem = await prisma.watchlistItem.findUnique({
      where: {
        id,
      },
    });

    if (watchlistItem.userId !== req.user.id) {
      return res.status(403).json({
        error: "Unauthorized: You can only delete your own watchlist items",
      });
    }

    const deletedEntry = await prisma.watchlistItem.delete({
      where: {
        id,
        userId: req.user.id, // Ensure the user can only delete their own watchlist items
      },
    });
    res.status(200).json({
      status: "Movie Removed from Watchlist",
      data: {
        deletedEntry,
      },
    });
  } catch (error) {
    res.status(404).json({ error: "Watchlist item not found" });
  }
};

export {
  addToWatchlist,
  deleteFromWatchlist,
  updateWatchlistItem,
  getAllWatchlistItems,
};
