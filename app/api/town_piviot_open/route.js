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
            END AS type,
                CASE 
                    WHEN c.town_id = 1 THEN 'NORTH NAZIMABAD' 
                    WHEN c.town_id = 5 THEN 'SHAH FAISAL' 
                    WHEN c.town_id = 6 THEN 'BALDIA' 
                    WHEN c.town_id = 7 THEN 'IBRAHIM HYDRY' 
                    WHEN c.town_id = 8 THEN 'MANGOPIR (SURJANI)' 
                    WHEN c.town_id = 9 THEN 'GULBERG' 
                    WHEN c.town_id = 10 THEN 'GULSHAN E IQBAL' 
                    WHEN c.town_id = 11 THEN 'CHANESAR' 
                    WHEN c.town_id = 12 THEN 'KEAMARI' 
                    WHEN c.town_id = 13 THEN 'KORANGI' 
                    WHEN c.town_id = 14 THEN 'LANDHI' 
                    WHEN c.town_id = 15 THEN 'LIAQUATABAD' 
                    WHEN c.town_id = 16 THEN 'LYARI TOWN' 
                    WHEN c.town_id = 17 THEN 'MALIR TOWN' 
                    WHEN c.town_id = 18 THEN 'NEW KARACHI' 
                    WHEN c.town_id = 19 THEN 'ORANGI TOWN' 
                    WHEN c.town_id = 20 THEN 'SADDAR TOWN' 
                    WHEN c.town_id = 2 THEN 'CLIFTON' 
                    WHEN c.town_id = 40 THEN 'SITE (MORIRO MIR BAHAR)' 
                    WHEN c.town_id = 41 THEN 'MODEL ZONE' 
                    WHEN c.town_id = 42 THEN 'NAZIMABAD' 
                    WHEN c.town_id = 43 THEN 'SAFOORA' 
                    WHEN c.town_id = 44 THEN 'SOHRAB GOTH' 
                    WHEN c.town_id = 45 THEN 'GULISTAN E JOHAR' 
                    WHEN c.town_id = 46 THEN 'MOMINABAD' 
                    WHEN c.town_id = 47 THEN 'SITE TOWN' 
                    WHEN c.town_id = 48 THEN 'JINNAH TOWN' 
                    WHEN c.town_id = 49 THEN 'GADAP' 
                END AS TOWN,
                COUNT(c.comp_num) AS total_registered,
                COUNT(CASE WHEN c.status = 1 THEN c.comp_num END) AS resolved,
                COUNT(CASE WHEN c.status = 0 THEN c.comp_num END) AS pending,
                ROUND(COUNT(CASE WHEN c.status = 1 THEN c.comp_num END) * 100.0 / COUNT(c.comp_num), 2) AS resolved_percentage
            FROM 
                \`complaint\` c
            WHERE 
                c.subtype_id = 21 
                AND c.created_at >= '2025-01-08 00:00:00'
            GROUP BY 
                c.town_id ;
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
  