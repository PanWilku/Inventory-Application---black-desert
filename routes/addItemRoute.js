const { Router } = require('express');
const { getAddItem, postAddItem } = require('../controllers/addItemController');



const router = Router();


router.get("/", getAddItem);
router.post("/", postAddItem);



module.exports = { addItemRouter: router };