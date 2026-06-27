const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const authRoutes = require('./routes/auth.routes')

const app = express();
// 2. Body Parser Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.includes('localhost') || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
 
app.use('/api/auth', authRoutes);

module.exports = app;