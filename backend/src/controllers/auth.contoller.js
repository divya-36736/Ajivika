const hirerModel = require('../models/hirer.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require("../models/blacklist.model");

async function registerHirerController(req, res) {
    const { name, email, password, hiringLocation, uid } = req.body;

    if (!name || !email || !password || !hiringLocation || !uid) {
        return res.status(400).json({ message: 'Name, email, password, hiring location, and UID are required' });
    }
 
    const isHirerAlreadyExists = await hirerModel.findOne({
        $or: [{ email }, { uid }]
    });

    if (isHirerAlreadyExists) {
        return res.status(400).json({
            message: 'Account is already registered with this email or UID'
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const hirer = await hirerModel.create({
        name,
        email,
        password: hash,
        hiringLocation,
        uid
    });

    const token = jwt.sign({
        id: hirer._id,
        name: hirer.name,
    }, process.env.JWT_SECRET,
    { expiresIn: '1d' });

    res.cookie("token", token);

    res.status(201).json({
        message: 'Hirer registered successfully',
        hirer: {
            id: hirer._id,
            name: hirer.name,
            email: hirer.email,
            hiringLocation: hirer.hiringLocation,
            uid: hirer.uid
        }
    });
}

async function loginHirerController(req, res) {
    const { email, password } = req.body;

    const hirer = await hirerModel.findOne({ email });

    if (!hirer) {
        return res.status(400).json({
            message: 'Invalid email or password'
        });
    }

    const isPasswordValid = await bcrypt.compare(password, hirer.password);
    
    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid email or password'
        });
    }

    const token = jwt.sign({
        id: hirer._id,
        name: hirer.name,
    }, process.env.JWT_SECRET,
    { expiresIn: '1d' });

    res.cookie("token", token);

    res.status(200).json({
        message: 'Login successfully',
        hirer: {
            id: hirer._id,
            name: hirer.name,
            email: hirer.email
        }
    });
}

async function logoutHirerController(req, res) {
    const token = req.cookies.token;

    if (token) {
        await tokenBlacklistModel.create({ token });
    }

    res.clearCookie('token');
    
    res.status(200).json({
        message: 'Logout successfully'
    });
}

module.exports = { registerHirerController, loginHirerController, logoutHirerController };