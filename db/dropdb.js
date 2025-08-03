require("dotenv").config();
const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS items;
`;

async function main() {
  console.log("dropping table...");
  const client = new Client({
    connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/bdo_market`,
  });
  try {
    await client.connect();
    await client.query(SQL);
    console.log("table dropped");
  } catch (err) {
    console.error("error dropping table:", err);
  } finally {
    await client.end();
  }
}

main();