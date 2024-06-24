const express = require('express');
const menuRouter = express.Router();
const menuController = require('../controllers/menuController');



menuRouter.post('/items', menuController.createMenuItem);
menuRouter.get('/items', menuController.getAllMenuItems);
menuRouter.get('/items/:id', menuController.getMenuItemById);
menuRouter.put('/items/:id', menuController.updateMenuItem);
menuRouter.delete('/items/:id', menuController.deleteMenuItem);
module.exports = menuRouter;    