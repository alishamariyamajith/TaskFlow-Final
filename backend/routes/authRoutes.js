const express = require('express');
const router = express.Router();
const { registerAdmin, createMember, loginUser, currentUser } = require('../controllers/authController');
const protect = require('../middleware/protect');

router.post('/register-admin', registerAdmin); // Only once, or protected if needed
router.post('/login', loginUser);
router.get('/me', protect, currentUser);
router.post('/create-member', protect, createMember); // Only admin allowed

module.exports = router;