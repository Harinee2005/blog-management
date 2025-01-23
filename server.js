const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
});

// User schema and model
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    isVerified: Boolean,
});

const User = mongoose.model('User', userSchema);

// Middleware for user authentication
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access Denied');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user;
        next();
    });
};

// Middleware for role-based access control
const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).send('Access Denied');
    next();
};

// Route: Sign Up
app.post('/signup', async (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role, isVerified: false });

    await newUser.save();
    res.send('Sign up successful.');
});

// Route: Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password))
        return res.status(400).send('Invalid Email or Password');

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.send({ token });
});

// Route: Manage Blog Posts
const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', blogSchema);

app.post('/blog', authenticateToken, async (req, res) => {
    const { title, content } = req.body;
    const newBlog = new Blog({ title, content, author: req.user.id });
    await newBlog.save();
    res.send('Blog post created');
});

app.get('/blogs', async (req, res) => {
    const blogs = await Blog.find().populate('author', 'username');
    res.send(blogs);
});

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Blog Management System API!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
