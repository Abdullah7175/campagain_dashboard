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
            COUNT(c.comp_num) AS total_registered,
            COUNT(CASE when c.source = "webpage" then 1 END) as webpage,
            COUNT(CASE when c.source = "Mobile App" then 1 END) as Mobile_App,
            COUNT(CASE when c.source = "Call Center (CC)" then 1 END) as Call_Center_CC
        FROM 
            \`complaint\` c
        WHERE 
            c.subtype_id IN (21, 22) 
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