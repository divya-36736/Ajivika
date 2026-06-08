const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const authRoutes = require('./routes/auth.routes')

const app = express();
// 2. Body Parser Middleware
app.use(express.json());
// 3. Cookie Parser Middleware (You imported it, but forgot this line!)
app.use(cookieParser());

app.use(cors({
  origin: function (origin, callback) {
    // Agar request localhost se ya vercel.app se aa rahi hai, toh allow kar do
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