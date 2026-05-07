const express = require('express');
const router = express.Router();
const inquiriesController = require('../controllers/inquiries');

router.get('/', inquiriesController.getAll);
router.get('/:id', inquiriesController.getById);
router.post('/', inquiriesController.create);
router.put('/:id', inquiriesController.update);
router.delete('/:id', inquiriesController.remove);

router.get('/:id/notes', inquiriesController.getNotes);
router.post('/:id/notes', inquiriesController.addNote);

module.exports = router;
