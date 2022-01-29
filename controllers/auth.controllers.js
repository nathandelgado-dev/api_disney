const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const {
    createJWT,
    transporter,
    mailOptions
} = require('../helpers');
const { User } = require('../models')



const createUser = async(req, res = response) => {
    const { email, pass } = req.body;
    try {
        const isExistUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (isExistUser) {
            return res.status(400).json({
                msg: `Exist ${email}`
            })
        }

        const newUser = new User({
            email,
            pass
        });

        //Crypt the pass
        const salt = bcryptjs.genSaltSync();
        newUser.pass = bcryptjs.hashSync(pass, salt);

        //Send Email
        transporter.sendMail(mailOptions(newUser.email, 'Welcome to Disney Api'), (err, resp) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Email sent: ' + resp.response);
            }
        });

        await newUser.save();
        res.status(201).json({
            msg: 'User created'
        });
    } catch (err) {
        console.error(`Not create user: ${err}`)
        res.status(500).json({
            msg: 'Contact the administrator'
        });
    }
}

const signinUser = async(req, res = response) => {
    const { email, pass } = req.body;
    try {
        //is exist user 
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(400).json({
                msg: "The email or passsword is wrong"
            })
        }

        //Verify pass
        const validPass = bcryptjs.compareSync(pass, user.pass);
        if (!validPass) {
            return res.status(400).json({
                msg: "The email or passsword is wrong"
            })
        }

        //Create JWT
        const token = await createJWT(user.email);

        res.status(200).json({
            'x-disney-key': token
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Contact to administrator"
        })
    }
}

module.exports = {
    createUser,
    signinUser
}