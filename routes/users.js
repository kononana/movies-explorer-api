const router = require('express').Router();
const validation = require('../middlewares/validation');
const { getCurrentUser, updateUserInfo } = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', validation.checkUserInfo, updateUserInfo);

module.exports = router;
