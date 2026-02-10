const User = require('../models/user.js');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -plaidItems.transactions');
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}