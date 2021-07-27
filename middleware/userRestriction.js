const Sauce = require('../models/Sauce');

module.exports = async (req, res, next) => {
    try {
    const sauce = await Sauce.findOne({ _id: req.params.id })
        if( sauce.userId === req.userId) {
        throw new Error('Autorisation refusée');
        }
        next();
    } catch(error) {
      res.status(401).json({
        "error": error.message
      });
    }
};