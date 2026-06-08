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
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174", 
    "https://ajivika.vercel.app",
    "https://ajivika-git-main-divya-36736s-projects.vercel.app",
    "https://ajivika-842exboib-divya-36736s-projects.vercel.app"
  ],
  credentials: true
}));
 
app.use('/api/auth', authRoutes);

module.exports = app;