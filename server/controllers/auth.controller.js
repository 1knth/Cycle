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
            return res.status(404).send({ message: "User Not found." });
        }

        // 2. COMPARE: Check if the password matches the hash
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

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

        // 4. RESPOND: Send data back to React
        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            accessToken: token
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


