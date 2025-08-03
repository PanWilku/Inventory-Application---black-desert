const db = require('../db/pool');




const getCategory = async (req, res) => {
    console.log('Add category route hit');
    res.render("addCategory");
};


const postCategory = async (req, res) => {

    const data = req.body;

    console.log("Received data:", data);



    //adding category
    let newID;
    //check if category name already exists
    const existingCategory = await db.query('SELECT * FROM categories WHERE name = $1', [data.category]);
    if (existingCategory.rows.length > 0) {
        res.status(400).send("Category already exists");
        return;
    } else {
        const maxIDQuery = await db.query(`SELECT MAX(id) AS max_id FROM categories`);
        const maxID = maxIDQuery.rows[0].max_id;
        newID = maxID + 5;
        let categoryData = await db.query('INSERT INTO categories (id, name) VALUES ($1, $2) RETURNING id, name', [newID, data.category]);
        categoryData = categoryData.rows[0];
        console.log("Inserted new category:", categoryData.id, categoryData.name);
    }









    //adding subcategory
    const existing = await db.query(
    'SELECT * FROM sub_categories WHERE category_id = $1 AND name = $2',
    [newID, data.subcategory]
    );

    let newsubcategoryId;

    if (existing.rows.length > 0) {

    res.status(400).send("Subcategory already exists");
    return;
    } else {

    const maxIdResult = await db.query('SELECT MAX(sub_id) AS max FROM sub_categories');
    const maxSubId = maxIdResult.rows[0].max || 0;
    newsubcategoryId = maxSubId + 1;

    }
 

    const result = await db.query(
    'INSERT INTO sub_categories (sub_id, name, category_id) VALUES ($1, $2, $3) RETURNING sub_id, name, category_id',
    [newsubcategoryId, data.subcategory, newID]
    );

    
    
    console.log("Inserted new subcategory:", result.rows[0]);


    res.redirect("/");

    }


module.exports = {
    postCategory,
    getCategory,
}