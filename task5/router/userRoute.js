const express = require('express');
const User = require('../models/user');
const jwt =  require('jsonwebtoken');
const router = express.Router();

router.post('/user/register', async (req, res) => {

  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if(existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }


  const user = await User.create({
    username,
    email,
    password
  });

  res.json({message:"success"});
});

router.post('/user/login', async (req, res) => {
console.log("Loginnnnnnn============================");

  const {  email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await User.findOne({ email });

  if(!user) {
    return res.status(400).json({ message: 'User Not Found' });
  }
  if(user.password !== password) {
    return res.status(400).json({ message: 'Invalid Credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.cookie('token', token, { httpOnly: true });
  res.json({message:"success", token , user});
});

router.get('/user/profile',isLoggedIn, async (req, res) => {
  const user = await User.findById(req.userId)

  if(!user) {
    return res.status(400).json({ message: 'User Not Found' });
  }

  res.json({message:"success", profile: user});
});

router.put('/user/profile/update',isLoggedIn, async (req, res) => {
  const user = await User.findById(req.userId);

  if(!user) {
    return res.status(400).json({ message: 'User Not Found' });
  }
  const { username, bio } = req.body;

  user.username = username || user.username;
  user.title = req.body.title || user.title;
  user.phone = req.body.phone || user.phone;
  user.location = req.body.location || user.location;
  user.bio = bio || user.bio;
  user.avatar = req.body.avatar || user.avatar;


  await user.save();

  res.json({message:"success"});
});

function isLoggedIn(req, res, next) {
  // Placeholder for authentication logic
  // In a real application, you would check if the user is authenticated
  const token = req.headers['authorization'].split(' ')[1] || req.cookies['token'] ;
  console.log(token);
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.userId = decoded.id;

  console.log(req.userId);
  next();
}

module.exports = router;
