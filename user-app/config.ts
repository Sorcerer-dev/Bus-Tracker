// config.ts

// Change this to your PC's LAN IP when testing locally
const LOCAL_IP = "10.220.81.43"; // ← replace with your PC IP
const LOCAL_PORT = 5000;

// Your Render deployment URL (or other production URL)
const PRODUCTION_URL = "https://your-render-app.onrender.com";

export const API_BASE_URL = `http://${LOCAL_IP}:${LOCAL_PORT}`;
