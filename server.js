// server.js
require("dotenv").config();
const WebSocket = require("ws");
const axios = require("axios");

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("✅ WebSocket server running on ws://localhost:8080");
});

wss.on("connection", (ws) => {
  console.log("🔗 Client connected");

  ws.on("message", async (message) => {
    if (message.toString() === "get-news") {
      try {
        const apiKey = process.env.NEWS_API_KEY;
        const url = `https://newsapi.org/v2/everything?q="air quality" AND "India"&language=en&sortBy=publishedAt&apiKey=${apiKey}`;
        const response = await axios.get(url);
        ws.send(JSON.stringify({ status: "success", articles: response.data.articles }));
      } catch (error) {
        console.error(error);
        ws.send(JSON.stringify({ status: "error", message: "Failed to fetch news." }));
      }
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});
