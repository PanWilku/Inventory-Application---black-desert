const path = require("path");
require("dotenv").config({ path: path.join(__dirname, '..', '.env') });
const fs = require("fs");
const { Client } = require("pg");
const categoriesData = require("../data/categories.json")



async function main() {
    
    const client = new Client({
    connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/bdo_market`,
    });

    await client.connect();
    console.log("connected to db");

    try {
        for( const [catId, catInfo] of Object.entries(categoriesData)) {
        const catName = catInfo.name;

        await client.query(`INSERT INTO categories (id, name) VALUES ($1, $2);`, [catId, catName]);

        for(const [subcatId, subCatInfo] of Object.entries(catInfo.sub_categories)) {
            const subCatName = subCatInfo.name;
            await client.query(`INSERT INTO sub_categories (category_id, sub_id, name) VALUES ($1, $2, $3);`, [catId, subcatId, subCatName]);
        }
    }
    } catch (error) {
        console.log("Error inserting categories:", error);
    }
    await client.end();
    console.log("Categories inserted successfully");


}


main();
