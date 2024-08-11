// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { handleOrderCheckout } = require('../controllers/orderController');

router.post('/', handleOrderCheckout);

module.exports = router;
