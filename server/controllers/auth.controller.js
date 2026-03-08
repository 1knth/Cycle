import User from '../models/user.js';
import PlaidItem from '../models/plaid-item.model.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    // json post req with body
    const {username, email, password} = req.body;

    try {
        const user = await User.create({
            username: username,
            email: email,
            password: await bcrypt.hash(password, 12),
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {expiresIn: 86400}
        ) 
        res.status(201).send({
            message: "User registered successfully!",
            id: user._id,
            username: user.username,
            email: user.email,
            accessToken: token
        });
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).send({ message: "Invalid username or password." });
        }

        const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
        if (!passwordIsValid) {
            return (
                res.status(401).send({accessToken: null, message: "Invalid Password!"})
            );
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: 86400 }
        );

        const plaidItemCount = await PlaidItem.countDocuments({ user: user._id });
        
        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            accessToken: token,
            hasBankLinked: plaidItemCount > 0,
            bankCount: plaidItemCount
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized!' });
        }
        req.user = { _id: decoded.id };
        next();
    });
};