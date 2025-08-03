const db = require('../db/pool');
require('dotenv').config();



const getDeleteCategory = async (req, res) => {

    const data = req.body;
    console.log("Data received for deletion:", data);
    const categoryData = await db.query('SELECT * FROM categories');
    res.render("deleteCategory", { dataCategories: categoryData.rows });

}


const postDeleteCategory = async (req, res) => {
    const data = req.body;
    console.log("Data received for deletion:", data.category);

    if (data.adminPassword !== process.env.ADMIN_PASSWORD) {
        res.status(403).send("Forbidden: Incorrect admin password");
        return;
    }


    if(data.category === "") {
        res.status(400).send("No category selected for deletion");
        return;
    } else {

        await db.query('DELETE FROM sub_categories WHERE category_id = $1', [data.category]);
        await db.query('DELETE FROM categories WHERE id = $1', [data.category]);
        await db.query('DELETE FROM items WHERE maincategory = $1', [data.category]);

    }
    console.log("Category deleted:", data.category);
    res.redirect("/");
}

module.exports = {
    getDeleteCategory,
    postDeleteCategory
}