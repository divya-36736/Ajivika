// src/api/axios.js
import axios from 'axios';

const API = axios.create({
    // baseURL: 'http://localhost:3000/api', // Aapka backend URL
    baseURL:'https://ajivika.onrender.com/api',
    withCredentials: true // Cookies (Token) send karne ke liye zaroori hai
});

export default API;
