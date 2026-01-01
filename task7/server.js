require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

require('./config/passport');
const connectDB = require('./db/conn');
const authRoutes = require('./routes/authRoute');
const weatherRoutes = require('./routes/weatherRoute');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

const app = express();


app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 60,                  // 100 requests per IP
  message: "Too many requests, please try again later."
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many login attempts, please try again later."
});

app.use('/api', apiLimiter);
app.use('/auth', authLimiter);

app.use('/auth', authRoutes);
app.use('/api/weather', weatherRoutes);

app.use(errorHandler);

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
