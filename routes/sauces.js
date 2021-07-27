const express = require('express');
const router = express.Router();


const auth = require('../middleware/auth');
const userRestriction = require('../middleware/userRestriction');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

router.get('/',auth,  saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauces);
router.get('/:id', auth, saucesCtrl.getOneSauces);
router.put('/:id', auth, userRestriction, multer, saucesCtrl.modifySauces);
router.delete('/:id', auth, userRestriction, saucesCtrl.deleteSauces);
router.post('/:id/like', auth, saucesCtrl.addLikeDislike)

module.exports = router;