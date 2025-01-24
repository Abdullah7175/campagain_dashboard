import mysql from "mysql2/promise";

const dbUrl = process.env.DATABASE_URL;
const pass = process.env.DATABASE_PASS;
// Database configuration
const dbConfig = {
  host: dbUrl,
  user: "rocky",
  password: pass,
  database: "mshostin_kwsb",
  port: 3306, // Default MySQL port
};

// Route for id = 22
export async function GET(request) {
    try {
      const connection = await mysql.createConnection(dbConfig);
  
      const query = `
        SELECT 
            u.name AS Executive_Engineer,
            t.town AS Town,
            st.title AS Department,
            COUNT(c.id) AS Total_Complaints,
            COUNT(CASE WHEN c.status = 1 THEN 1 END) AS Resolved,
            COUNT(CASE WHEN c.status = 0 THEN 1 END) AS Pending,
            ROUND((COUNT(CASE WHEN c.status = 1 THEN 1 END) * 100.0 / COUNT(c.id)), 2) AS Percentage_Resolved,
            COUNT(CASE when c.source = "webpage" then 1 END) as webpage,
            COUNT(CASE when c.source = "Mobile App" then 1 END) as Mobile_App,
            COUNT(CASE when c.source = "Call Center (CC)" then 1 END) as Call_Center_CC
        FROM \`complaint\` c
        LEFT JOIN \`complaint_assign_agent\` ca ON ca.complaint_id = c.id 
        JOIN \`mobile_agent\` ma ON ma.id = ca.agent_id 
        LEFT JOIN \`users\` u ON u.id = ma.user_id 
        JOIN \`complaint_types\` ct ON c.type_id = ct.id 
        LEFT JOIN \`sub_types\` st ON st.id = c.subtype_id 
        JOIN \`towns\` t ON t.id = c.town_id 
        JOIN \`district\` d ON t.district_id = d.id 
        LEFT JOIN \`subtown\` s ON s.id = c.sub_town_id 
        LEFT JOIN \`customers\` c2 ON c2.id = c.customer_id 
        WHERE c.type_id = 1 
          AND c.subtype_id = 22 
          AND c.created_at >= '2025-01-08 00:00:00'
        GROUP BY u.name, t.town, st.title
        ORDER BY u.name;
      `;
  
      const [rows] = await connection.execute(query);
      connection.end();
  
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching data for id 22:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch data for id 22" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  