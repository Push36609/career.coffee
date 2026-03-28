import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/reviews", async (req, res) => {
  try {
    const placeId = "YOUR_PLACE_ID";
    const apiKey = "YOUR_GOOGLE_API_KEY";

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,name&key=${apiKey}`;

    const response = await axios.get(url);

    res.json(response.data.result.reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

export default router;