import jwt from "jsonwebtoken";
import { queryOne } from "../data/database.js";

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Re-fetch the live role from DB so stale tokens never cause wrong role checks
    const liveUser = await queryOne("SELECT id, user_id, name, email, role FROM users WHERE id = ?", [decoded.id]);

    if (!liveUser) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    const realRole = liveUser.role;

    req.user = {
      ...decoded,
      // superadmin passes all admin checks transparently
      role: realRole === "superadmin" ? "admin" : realRole,
      // preserve the actual role for superadmin-specific gates
      realRole,
      isSuperAdmin: realRole === "superadmin",
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}