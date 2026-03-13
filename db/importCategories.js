const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { Client } = require("pg");
const categoriesData = require("../data/categories.json");

async function main() {
    const client = new Client({
        connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/bd_app`,
    });

    await client.connect();
    console.log("Connected to db");

    try {
        await client.query("BEGIN");

        await client.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS sub_categories (
                category_id INTEGER NOT NULL,
                sub_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                PRIMARY KEY (category_id, sub_id),
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS items (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                item_id INTEGER NOT NULL UNIQUE,
                currentStock INTEGER NOT NULL DEFAULT 0,
                totalTrades BIGINT NOT NULL DEFAULT 0,
                basePrice BIGINT NOT NULL DEFAULT 0,
                mainCategory INTEGER NOT NULL,
                subCategory INTEGER NOT NULL,
                FOREIGN KEY (mainCategory) REFERENCES categories(id) ON DELETE RESTRICT,
                FOREIGN KEY (mainCategory, subCategory)
                    REFERENCES sub_categories(category_id, sub_id)
                    ON DELETE RESTRICT
            );
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_items_item_id ON items(item_id);
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_items_main_sub_cat
            ON items(mainCategory, subCategory);
        `);

        for (const [categoryId, categoryInfo] of Object.entries(categoriesData)) {
            await client.query(
                `
                    INSERT INTO categories (id, name)
                    VALUES ($1, $2)
                    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
                `,
                [Number(categoryId), categoryInfo.name]
            );

            for (const [subCategoryId, subCategoryInfo] of Object.entries(categoryInfo.sub_categories)) {
                await client.query(
                    `
                        INSERT INTO sub_categories (category_id, sub_id, name)
                        VALUES ($1, $2, $3)
                        ON CONFLICT (category_id, sub_id) DO UPDATE SET name = EXCLUDED.name;
                    `,
                    [Number(categoryId), Number(subCategoryId), subCategoryInfo.name]
                );
            }
        }

        await client.query("COMMIT");
        console.log("Tables and categories created successfully");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error creating tables and categories:", error);
    } finally {
        await client.end();
        console.log("Disconnected from db");
    }
}

main();
