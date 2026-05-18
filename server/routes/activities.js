const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activities');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, activitiesController.getRecent);

module.exports = router;
