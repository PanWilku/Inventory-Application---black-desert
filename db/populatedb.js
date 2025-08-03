#! /usr/bin/env node
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { Client } = require("pg");
const fs = require("fs");



console.log("Using PGUSER:", process.env.PGUSER);



// 1. Read JSON data
const filePath = path.join(__dirname, "../data/items.json");
const items = JSON.parse(fs.readFileSync(filePath, "utf8"));

async function main() {
  console.log("Seeding from items.json...");

  const client = new Client({
    connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/bdo_market`,
  });

  await client.connect();

  // 2. Insert each item
  for (const item of items) {
    const query = `
      INSERT INTO items (
        name, item_id, currentStock, totalTrades, basePrice, mainCategory, subCategory
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ;
    `;

    const values = [
      item.name,
      item.id,
      item.currentStock,
      item.totalTrades,
      item.basePrice,
      item.mainCategory,
      item.subCategory,
    ];

    try {
      await client.query(query, values);
    } catch (err) {
      console.error(`Failed to insert item ${item.name}:`, err.message);
    }
  }

  await client.end();
  console.log("Seeding complete.");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
});
