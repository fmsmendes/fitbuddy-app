const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, messageController.sendMessage);
router.get('/conversation/:userId', authMiddleware, messageController.getConversation);
router.get('/conversations', authMiddleware, messageController.getAllConversations);

module.exports = router;
