const express = require('express');
const router = express.Router();
const inquiriesController = require('../controllers/inquiries');

router.get('/', inquiriesController.getAll);
router.get('/:id', inquiriesController.getById);
router.post('/', inquiriesController.create);
router.put('/:id', inquiriesController.update);
router.delete('/:id', inquiriesController.remove);

<<<<<<< HEAD
router.get('/:id/notes', inquiriesController.getNotes);
router.post('/:id/notes', inquiriesController.addNote);

=======
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
module.exports = router;
