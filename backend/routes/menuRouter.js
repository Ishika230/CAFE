const express = require('express');
const menuRouter = express.Router();
const menuController = require('../controllers/menuController');



menuRouter.post('/items', menuController.createMenuItem);
menuRouter.get('/items', menuController.getAllMenuItems);
menuRouter.get('/items/:shortName', menuController.getMenuItem);
menuRouter.patch('/items/:shortName', menuController.updateMenuItem);
menuRouter.delete('/items/:shortName', menuController.deleteMenuItem);
module.exports = menuRouter;    