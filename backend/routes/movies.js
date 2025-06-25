const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

// ✅ Add movies (single or multiple)
router.post('/add', async (req, res) => {
  try {
    const data = req.body;
    const result = Array.isArray(data)
      ? await Movie.insertMany(data)
      : await new Movie(data).save();
    res.status(201).json({ msg: "Movie(s) added", movies: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ title: 1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update movie by ID
router.put('/:movieId', async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.movieId,
      req.body,
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ msg: 'Movie updated', movie: updatedMovie });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Add a review (requires token)
router.post('/:movieId/reviews', verifyToken, async (req, res) => {
  const { rating, comment } = req.body;
  const movieId = req.params.movieId;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "You must login to give a review" });
  }

  if (!rating || !comment) {
    return res.status(400).json({ error: "Rating and comment are required" });
  }

  try {
    const review = new Review({
      movie: movieId,
      user: userId,
      rating,
      comment
    });

    await review.save();

    const reviews = await Review.find({ movie: movieId });
    const avgRating =
      reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    await Movie.findByIdAndUpdate(movieId, {
      averageRating: avgRating.toFixed(1),
      reviewCount: reviews.length
    });

    res.status(201).json({ msg: "Review added", review });
  } catch (err) {
    console.error("Review error:", err.message);
    res.status(500).json({ error: "Could not add review" });
  }
});

// ✅ Get reviews for a movie
router.get('/:movieId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId })
      .populate('user', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Top rated
router.get('/top-rated', async (req, res) => {
  const movies = await Movie.find({ averageRating: { $gt: 0 } })
    .sort({ averageRating: -1 })
    .limit(10);
  res.json(movies);
});

// ✅ Lowest rated
router.get('/low-rated', async (req, res) => {
  const movies = await Movie.find({ averageRating: { $gt: 0 } })
    .sort({ averageRating: 1 })
    .limit(10);
  res.json(movies);
});

// ✅ Most recent
router.get('/recent', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ releaseYear: -1 }).limit(10);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Oldest
router.get('/oldest', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ releaseYear: 1 }).limit(10);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Search by title
router.get('/search/:title', async (req, res) => {
  try {
    const movies = await Movie.find({
      title: { $regex: req.params.title, $options: 'i' }
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Filter by stars
router.get('/filter/:stars', async (req, res) => {
  try {
    const rating = parseInt(req.params.stars);
    const movies = await Movie.find({ averageRating: { $gte: rating } });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a single movie with reviews (for review page)
router.get('/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const reviews = await Review.find({ movie: req.params.movieId })
      .populate('user', 'username');

    res.json({
      ...movie.toObject(),
      reviews
    });
  } catch (err) {
    console.error("Error fetching movie with reviews:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
