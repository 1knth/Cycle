const User = require('../models/user.js');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const {username, email, password} = req.body;
    
    try {
        const user = await User.create({
            username,
            email,
            password: await bcrypt.hash(password, 12),
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {expiresIn: 86400} // 24 hours
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

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).send({ message: "Invalid username or password." });
        }

        // 2. COMPARE: Check if the password matches the hash
        // node js is singled threaded, use await bc of compare(sync) -> e.g stops for 100-300ms
        const passwordIsValid = await bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return (
                res.status(401).send({accessToken: null, message: "Invalid Password!"})
            );
        }

        // 3. SIGN: Generate the Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: 86400 } // 24 hours
        );
        // 4. RESPOND: Send data back to React (including bank details)
        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            accessToken: token,
            plaidItemId: user.plaidItemId || null,
            hasBankLinked: !!user.plaidAccessToken
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.verifyToken = (req, res, next) => {
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

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            plaidItemId: user.plaidItemId || null,
            hasBankLinked: !!user.plaidAccessToken
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};