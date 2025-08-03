const { Router } = require('express');
const { getCategory, postCategory } = require('../controllers/addCategoryController');


const router = Router();


router.get('/', getCategory);

router.post('/', postCategory);

module.exports = { addCategoryRouter: router };