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
  
      // Query for pivot data
      const pivotQuery = `
        SELECT 
            CASE 
                WHEN c.subtype_id = 21 THEN 'Open Manhole'
                WHEN c.subtype_id = 22 THEN 'Damaged Manhole'
            END AS type,
            COUNT(c.comp_num) AS total_registered,
            COUNT(CASE WHEN c.status = 1 THEN c.comp_num END) AS resolved,
            COUNT(CASE WHEN c.status = 0 THEN c.comp_num END) AS pending,
            ROUND(COUNT(CASE WHEN c.status = 1 THEN c.comp_num END) * 100.0 / COUNT(c.comp_num), 2) AS resolved_percentage
        FROM 
            \`complaint\` c
        WHERE 
            c.subtype_id IN (21, 22) 
            AND c.created_at >= '2025-01-08 00:00:00'
        GROUP BY 
            c.subtype_id;
      `;
  
      const [pivotData] = await connection.execute(pivotQuery);
      connection.end();
  
      return new Response(JSON.stringify(pivotData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching pivot data:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch pivot data" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  