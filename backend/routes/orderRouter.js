// routes/orderRoutes.js
const express = require('express');
const orderRouter = express.Router();
const { handleOrderCheckout } = require('../controllers/orderController');

orderRouter.post('/', handleOrderCheckout);

module.exports = orderRouter;
