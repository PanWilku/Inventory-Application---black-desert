const db = require('../db/pool');

const search = async (req, res) => {
  const searchTerm = req.query.search;
  const categoryId = req.query.category;

  console.log("Search term:", searchTerm);
  console.log("Category ID:", categoryId);

  let query = `SELECT * FROM items WHERE name ILIKE $1`;
  let params = [`%${searchTerm}%`];

  if (categoryId) {
    query += ` AND maincategory = $2`;
    params.push(categoryId);
  }

  try {
    const result = await db.query(query, params);
    const dataItems = result.rows;

    const categoryData = await db.query('SELECT * FROM categories');
    const dataCategories = categoryData.rows;
    const SubcategoriesData = await db.query('SELECT * FROM sub_categories');
    const dataSubcategories = SubcategoriesData.rows;

    res.render("search", {
      dataItems,
      dataCategories,
      dataSubcategories
    });
  } catch (error) {
    console.error("❌ Error in search:", error);
    res.status(500).send("Internal Server Error");
  }
};




module.exports = {
    search,
}