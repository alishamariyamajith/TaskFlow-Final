const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
// ONLY Admins can be registered 
const registerAdmin = asyncHandler(async (req, res) => {
    debugger;
    const { username, email, password } = req.body;
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
        res.status(400);
        throw new Error("Admin already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
        username,
        email,
        password: hashedPassword,
        role: 'admin',
        userId: uuidv4()
    });

    res.status(201).json({
        _id: admin._id,
        email: admin.email,
        role: admin.role,
       
    });
});

// Admin creates member accounts with  password
const createMember = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error("Only admins can create members");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("Member already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const member = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
    });

    res.status(201).json({
        _id: member._id,
        email: member.email,
        role: member.role
    });
});

// login for both admin and member
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user._id,
                    role: user.role,
                    userId:user.userId
                }
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
        res.status(200).json({ _id: user._id, 
            userId:user.userId,
            username: user.username, 
            email: user.email, 
            role: user.role, 
            accessToken });
    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = { registerAdmin, createMember, loginUser, currentUser };