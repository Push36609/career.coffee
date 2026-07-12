import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/reviews", async (req, res) => {
  try {
    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!placeId || !apiKey) {
      return res.status(503).json({ error: "Google Reviews not configured" });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,name&key=${apiKey}`;

    const response = await axios.get(url);

    res.json(response.data.result?.reviews || []);
  } catch (error) {
    console.error("Google Reviews error:", error.message);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

export default router;