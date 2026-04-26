import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { initDb } from "./data/database.js";

import googleRoutes from "./routes/googleReviews.js";
import authRoutes from "./routes/auth.js";
import appointmentRoutes from "./routes/appointments.js";
import blogRoutes from "./routes/blogs.js";
import testimonialRoutes from "./routes/testimonials.js";
import contactRoutes from "./routes/contacts.js";
import examRoutes from "./routes/exams.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://careercoffee.in",
  "https://www.careercoffee.in"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (origin.endsWith("careercoffee.in")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

initDb()
  .then(() => {
    app.use("/api/google", googleRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/appointments", appointmentRoutes);
    app.use("/api/blogs", blogRoutes);
    app.use("/api/testimonials", testimonialRoutes);
    app.use("/api/contacts", contactRoutes);
    app.use("/api/exams", examRoutes);

    app.get("/api/health", (req, res) =>
      res.json({
        status: "OK",
        message: "CareerCoffee API Running ☕",
        db: "MySQL",
      })
    );

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "Something went wrong!" });
    });

    const server = app.listen(PORT, () => {
      console.log(`\nCareerCoffee Server running on http://localhost:${PORT}`);
      console.log(`API Health: http://localhost:${PORT}/api/health\n`);
    });

    process.on("SIGTERM", () => server.close(() => process.exit(0)));
    process.on("SIGINT", () => server.close(() => process.exit(0)));
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
