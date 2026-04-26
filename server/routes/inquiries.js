const express = require('express');
const router = express.Router();
const inquiriesController = require('../controllers/inquiries');

router.get('/', inquiriesController.getAll);
router.get('/:id', inquiriesController.getById);
router.post('/', inquiriesController.create);
router.put('/:id', inquiriesController.update);
router.delete('/:id', inquiriesController.remove);

module.exports = router;
