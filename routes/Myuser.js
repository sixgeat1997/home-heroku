const express = require('express'),
    myuser = express.Router(),
    User = require('../model/User'),
    bcryptjs = require('bcryptjs'),
    { regisValidation, loginValidation } = require('../validator/User_valid')

myuser.route('/register')
    .get((req, res) => {
        res.send("a")
    })
    .post(async (req, res) => {

        const { error } = regisValidation(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const userExist = await User.findOne({ username: req.body.username })
        if (userExist) return res.status(400).send('Username already exists')

        const salt = await bcryptjs.genSalt(10)
        const hashPass = await bcryptjs.hash(req.body.password, salt)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: hashPass
        })
        try {
            const savedUser = await user.save()
            res.send({ user_id: user._id })
        } catch (err) {
            res.status(400).send(err)
        }

    })

myuser.route('/login')
    .post(async (req, res) => {
        const { error } = loginValidation(req.body)
        if (error) res.status(400).send(error.details[0].message)

        const user = await User.findOne({ username: req.body.username })
        if (!user) return res.status(400).send("username not found")

        const validPass = await bcryptjs.compare(req.body.password, user.password)
        if (!validPass) return res.status(400).send("Invalid password")

        res.send("Logged in!")

    })

module.exports = myuser