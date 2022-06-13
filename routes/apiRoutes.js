const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const { verifyUser } = require("./auth")

router.get("/all", (req, res) => {
    db.User.findAll().then(users => res.send(users));
});

router.get("/auth", verifyUser, (req, res) => {
    try {
        console.log(req.user);
        if (req.user) {
            res.json(req.user);
        } else {
            res.json({ error: "not authorized" });
        }
    } catch (err) {
        console.log(err);
    }
})

router.post("/new", async(req, res) => {
    try {
        const values = req.body;
        const password = values.password;
        const user = await db.User.findOne({
            where: {
                email: values.email
            }
        })
        if (user) {
            res.send("error")
        } else {
            const hash = await bcrypt.hash(password, 10);
            console.log(values);
            await db.User.create({
                name: values.name,
                email: values.email,
                password: hash,
            })
            res.send("success")
        }

    } catch (e) {
        console.log(e);
    }
});

router.post("/login", async(req, res) => {
    try {
        const values = req.body;
        // console.log(values);
        const email = values.email;
        const password = values.password;
        const User = await db.User.findOne({
            where: {
                email: email
            }
        })
        if (!User) {
            res.json('Wrong pass!');
        } else {
            const validpass = await bcrypt.compare(password, User.password)
            if (!validpass) {
                res.status(404).json("User not found");
            } else {
                const token = jwt.sign({
                    id: User.id,
                    name: User.name,
                    email: User.email,
                    password: User.password

                }, "secretkey");
                res.json({
                    token,
                    id: User.id,
                    email: User.email,
                    name: User.name,
                    message: "success"
                });
            }
        }
    } catch (e) {
        console.log(e);
    }
});


module.exports = router;