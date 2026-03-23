import User from '../models/user.model.js';

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}
