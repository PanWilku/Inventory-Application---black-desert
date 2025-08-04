const db = require('../db/pool');

const index = async (req, res) => {
    const itemsPerPage = 20;
    const currentPage = parseInt(req.query.page) || 1;
    console.log("Current Page:", req.query.page);
    const offset = (currentPage - 1) * itemsPerPage;

    try {
        // Get items for this page
        const dataItemsResult = await db.query(
            'SELECT * FROM items ORDER BY name LIMIT $1 OFFSET $2',
            [itemsPerPage, offset]
        );
        const dataItems = dataItemsResult.rows;

        // Get total item count for pagination
        const totalCountResult = await db.query('SELECT COUNT(*) FROM items');
        const totalItems = parseInt(totalCountResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / itemsPerPage);


        const dataCategoriesResult = await db.query('SELECT * FROM categories');
        const dataSubcategoriesResult = await db.query('SELECT * FROM sub_categories');

        res.render('index', {
            dataItems,
            dataCategories: dataCategoriesResult.rows,
            dataSubcategories: dataSubcategoriesResult.rows,
            currentPage,
            totalPages
        });
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    index,
};
