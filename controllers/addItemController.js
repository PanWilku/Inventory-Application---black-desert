const db = require('../db/pool');



const getAddItem = async (req, res) => {
    try {
        const categoryData = await db.query('SELECT * FROM categories');
        const dataCategories = categoryData.rows;
        const subcategoriesData = await db.query('SELECT * FROM sub_categories');
        const dataSubcategories = subcategoriesData.rows;

        res.render("addItem", { dataCategories, dataSubcategories });
    } catch (error) {
        console.error("❌ Error fetching categories:", error);
        res.status(500).send("Internal Server Error");
    }
}

const postAddItem = async (req, res) => {
    const data = req.body;
    console.log("Received data:", data.category, data.subcategory, data.name, data.currentstock, data.baseprice);

    const existingItem = await db.query('SELECT * FROM items WHERE name = $1 AND maincategory = $2 AND subcategory = $3', [data.name, data.category, data.subcategory]);
    if (existingItem.rows.length > 0) {
        res.status(400).send("Item already exists");
        return;
    }

    const maxIDResult = await db.query('SELECT MAX(item_id) AS max_id FROM items');
    const maxID = parseInt(maxIDResult.rows[0].max_id) || 0;
    const newID = maxID + 1;

    const result = await db.query('INSERT INTO items (item_id, name, currentstock, baseprice, maincategory, subcategory) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [newID, data.name, data.currentstock, data.baseprice, data.category, data.subcategory]);
    if (result.rows.length === 0) {
        res.status(500).send("Failed to add item");
        return;
    }
    console.log("Inserted new item:", result.rows[0]);
    res.redirect('/');
}



module.exports = {
    getAddItem,
    postAddItem
}