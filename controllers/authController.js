const User = require('../models/userModel');
const bcrypt = require('bcryptjs')


exports.signUp = async (req, res) => {

    const {username, password} = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            username,
            password: hashedPassword
        });
        req.session.user= newUser
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser,
            },
        });
    } catch (e) {
        console.log(e.message);
        res.status(400).json({
            status: 'fail',
            err: e.message
        });
    }
};


exports.login = async (req, res) => {
    const {username, password} = req.body

    try {
        const user = await User.findOne({username})

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: "User not found"
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password)
        if (isCorrect) {
            req.session.user = user
            res.status(200).json({
                status: "success",
                data: {
                    user
                }
            })
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'incorrect username or pass'
            })
        }


    } catch (e) {
        console.log(e.message);
        res.status(400).json({
            status: 'fail',
            err: e.message
        });
    }

}