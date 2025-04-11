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
        // Using your GNews API key directly here
        const apiKey = "6e591485b3a140830156949f0f0c0180";
        const url = `https://gnews.io/api/v4/search?q=air+quality+India&lang=en&country=in&max=10&token=${apiKey}`;
        
        const response = await axios.get(url);
        ws.send(JSON.stringify({ status: "success", articles: response.data.articles }));
      } catch (error) {
        console.error("🛑 Error fetching news:", error.message);
        ws.send(JSON.stringify({ status: "error", message: "Failed to fetch news." }));
      }
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});
