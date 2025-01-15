import mysql from "mysql2/promise";

// Database configuration
const dbConfig = {
  host: "210.2.130.186",
  user: "rocky",
  password: "**@/#Abc1",
  database: "mshostin_kwsb",
  port: 3306, // Default MySQL port
};

export async function GET(request) {
    try {
      const connection = await mysql.createConnection(dbConfig);
  
      const query = `
        SELECT 
          COUNT(c.comp_num) AS Registered, 
          COUNT(CASE WHEN c.status = 1 THEN 1 END) AS Resolved,
          COUNT(CASE WHEN c.status = 0 THEN 1 END) AS Pending
        FROM \`complaint\` c
        WHERE c.subtype_id IN (21, 22)
          AND c.created_at >= '2025-01-08 00:00:00';
      `;
  
      const [rows] = await connection.execute(query);
      connection.end();
  
      return new Response(JSON.stringify(rows[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching top cards data:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch top cards data" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  