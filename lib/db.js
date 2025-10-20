// Simple MySQL pool using mysql2/promise
// Reads connection from env. Ensure you install `mysql2`.

let pool;

export function getDbConfig() {
  return {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "natalie_site",
    waitForConnections: true,
    connectionLimit: 10,
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

