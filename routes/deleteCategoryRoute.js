const { Router } = require('express');
const { getDeleteCategory, postDeleteCategory } = require('../controllers/deleteCategoryController');


const router = Router();


router.get('/', getDeleteCategory);
router.post('/', postDeleteCategory);


module.exports = { deleteCategoryRouter: router };