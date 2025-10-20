import crypto from "node:crypto";
import { query } from "@/lib/db";

// Password hashing using Node's scrypt
function scryptAsync(password, salt, keylen = 64) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey);
    });
  });
}

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 64);
  const hash = derived.toString("hex");
  return { salt, hash };
}

export async function verifyPassword(password, salt, hash) {
  const derived = await scryptAsync(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), derived);
}

export function makeSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId, userAgent = null, ip = null, maxAgeDays = 7) {
  const token = makeSessionToken();
  const days = Number(maxAgeDays || 7);
  await query(
    `INSERT INTO sessions (user_id, token, user_agent, ip, expires_at)
     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))`,
    [userId, token, userAgent, ip, days]
  );
  return token;
}

export async function getSessionWithUser(token) {
  if (!token) return null;
  const rows = await query(
    `SELECT s.*, u.id as u_id, u.email, u.name, u.role
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token = ? AND s.expires_at > NOW()
      LIMIT 1`,
    [token]
  );
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    session: {
      id: row.id,
      userId: row.user_id,
      token: row.token,
      expiresAt: row.expires_at,
    },
    user: {
      id: row.u_id,
      email: row.email,
      name: row.name,
      role: row.role,
    },
  };
}

export async function invalidateSession(token) {
  if (!token) return;
  await query(`DELETE FROM sessions WHERE token = ?`, [token]);
}
