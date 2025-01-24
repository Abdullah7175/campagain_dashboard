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
    // Establish a database connection
    const connection = await mysql.createConnection(dbConfig);

    // SQL query
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
        AND c.subtype_id = 21 
        AND c.created_at >= '2025-01-08 00:00:00'
      GROUP BY u.name, t.town, st.title
      ORDER BY u.name;
    `;

    // Execute the query
    const [rows] = await connection.execute(query);

    // Close the connection
    connection.end();

    // Return the result
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching complaints data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch complaints data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
