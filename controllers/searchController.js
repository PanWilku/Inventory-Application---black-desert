const db = require('../db/pool');

const search = async (req, res) => {
  const searchTerm = req.query.search;
  const categoryId = req.query.category;
  console.log("Search term:", searchTerm);
  console.log("Category ID:", categoryId);


  let query = `SELECT * FROM items WHERE name ILIKE $1`;
  let params = [`%${searchTerm}%`];



  const itemsPerPage = 20;
  const currentPage = parseInt(req.query.page) || 1;
  const offset = (currentPage - 1) * itemsPerPage;



  if (categoryId) {
    query += ` AND maincategory = $2 ORDER BY name LIMIT $3 OFFSET $4`;
    params.push(categoryId, itemsPerPage, offset);
  } else {
    query += ` ORDER BY name LIMIT $2 OFFSET $3`;
    params.push(itemsPerPage, offset);
  }




  try {
    const result = await db.query(query, params);
    const dataItems = result.rows;

    const categoryData = await db.query('SELECT * FROM categories');
    const dataCategories = categoryData.rows;
    const SubcategoriesData = await db.query('SELECT * FROM sub_categories');
    const dataSubcategories = SubcategoriesData.rows;

    let countQuery = `SELECT COUNT(*) FROM items WHERE name ILIKE $1`;
    let countParams = [`%${searchTerm}%`];

    if (categoryId) {
      countQuery += ` AND maincategory = $2`;
      countParams.push(categoryId);
    }

    const totalCountResult = await db.query(countQuery, countParams);
    const totalItems = parseInt(totalCountResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / itemsPerPage);



    res.render("search", {
      dataItems,
      dataCategories,
      dataSubcategories,
      currentPage,
      totalPages,
      searchTerm,           // add this
      selectedCategory: categoryId // add this
    });
  } catch (error) {
    console.error("❌ Error in search:", error);
    res.status(500).send("Internal Server Error");
  }
};




module.exports = {
    search,
}