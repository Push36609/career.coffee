import express from "express";
import { query, queryOne, run } from "../data/database.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/**
 * Convert title to slug
 */
function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * PUBLIC BLOG LIST
 */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    if (category) {
      const blogs = await query(
        "SELECT * FROM blogs WHERE published = 1 AND category = ? ORDER BY id DESC",
        [category]
      );

      return res.json(blogs);
    }

    const blogs = await query(
      "SELECT * FROM blogs WHERE published = 1 ORDER BY id DESC"
    );

    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ADMIN: GET ALL BLOGS
 */
router.get("/all", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const blogs = await query("SELECT * FROM blogs ORDER BY id DESC");

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET BLOG BY SLUG
 */
router.get("/:slug", async (req, res) => {
  try {
    const blog = await queryOne(
      "SELECT * FROM blogs WHERE slug = ? AND published = 1",
      [req.params.slug]
    );

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * CREATE BLOG (ADMIN)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { title, summary, content, category, image_url, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    let slug = toSlug(title);

    const existing = await queryOne(
      "SELECT id FROM blogs WHERE slug = ?",
      [slug]
    );

    if (existing) {
      slug = slug + "-" + Date.now();
    }

    const result = await run(
      "INSERT INTO blogs (title, slug, summary, content, author, category, image_url, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        slug,
        summary || null,
        content,
        req.user.name,
        category || null,
        image_url || null,
        published !== undefined ? published : 1,
      ]
    );

    res.status(201).json({
      message: "Blog created",
      id: result.insertId,
      slug,
    });

  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ error: "Failed to create blog" });
  }
});

/**
 * UPDATE BLOG
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { title, summary, content, category, image_url, published } = req.body;

    await run(
      "UPDATE blogs SET title=?, summary=?, content=?, category=?, image_url=?, published=? WHERE id=?",
      [
        title || "",
        summary || null,
        content || "",
        category || null,
        image_url || null,
        published !== undefined ? published : 1,
        req.params.id,
      ]
    );

    res.json({ message: "Blog updated" });

  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
});

/**
 * DELETE BLOG
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await run("DELETE FROM blogs WHERE id = ?", [req.params.id]);

    res.json({ message: "Blog deleted" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;