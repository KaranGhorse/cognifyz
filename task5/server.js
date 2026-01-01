const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoute = require('./router/userRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});
app.use('/api', userRoute);

// DB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
