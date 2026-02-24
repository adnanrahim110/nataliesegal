// Simple MySQL pool using mysql2/promise
// Reads connection from env. Ensure you install `mysql2`.

let pool;

export function getDbConfig() {
  const isProd = process.env.NODE_ENV === "production";
  const host = process.env.DB_HOST || (!isProd ? "127.0.0.1" : "");
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || (!isProd ? "root" : "");
  const password = process.env.DB_PASSWORD || (!isProd ? "" : "");
  const database = process.env.DB_NAME || (!isProd ? "natalie_site" : "");

  if (isProd && (!host || !user || !database)) {
    throw new Error("Database environment variables are not configured.");
  }

  const connectionLimit = Number(process.env.DB_CONNECTION_LIMIT || process.env.DB_POOL_SIZE || 5);
  const safeConnectionLimit =
    Number.isFinite(connectionLimit) && connectionLimit > 0
      ? Math.floor(connectionLimit)
      : 5;

  return {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: safeConnectionLimit,
    queueLimit: 0,
  };
}

export async function getPool() {
  if (pool) return pool;
  const mysql = await import("mysql2/promise");
  pool = mysql.createPool(getDbConfig());
  return pool;
}

export async function query(sql, params = []) {
  const p = await getPool();
  const [rows] = await p.execute(sql, params);
  return rows;
}
