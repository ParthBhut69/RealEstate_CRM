const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const c = require('../controllers/alerts');

// SSE stream — no auth middleware (token in query param instead)
router.get('/stream', c.stream);

// All other routes require JWT auth
router.get('/unread-count', auth, c.getUnreadCount);
router.get('/', auth, c.getAll);
router.post('/', auth, c.create);
router.put('/read-all', auth, c.markAllRead);
router.put('/:id/read', auth, c.markRead);
router.put('/:id/resolve', auth, c.resolve);

module.exports = router;
