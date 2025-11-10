// netlify/functions/getOffers.js
import { Client } from "pg";

export async function handler() {
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL, // موجود في بيئة Netlify
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const res = await client.query(`
      SELECT code, title, description, features, area, price, deposit, commission, images
      FROM offers
      WHERE available = true
      ORDER BY id ASC;
    `);

    await client.end();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // عشان نقدر نجرب من أي مكان
        "Content-Type": "application/json",
      },
      body: JSON.stringify(res.rows),
    };
  } catch (err) {
    console.error("❌ Database Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
