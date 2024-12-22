const express = require('express');
const router = express.Router();
const reportsController= require('../controllers/reportsController');

router.get('/getReports', reportsController.getReports);
router.get('/download/:name', reportsController.downloadReport);

module.exports = router;
  