import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { generateResponse, testConnection } from "./services/gemini";
import { messageSchema } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test Gemini API connection
  app.get("/api/test-connection", async (req, res) => {
    try {
      const isConnected = await testConnection();
      res.json({ connected: isConnected });
    } catch (error) {
      res.status(500).json({ connected: false, error: "Connection test failed" });
    }
  });

  // Generate AI response
  app.post("/api/generate-response", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await generateResponse(message, conversationHistory || []);
      res.json({ response });
    } catch (error) {
      console.error("Error generating response:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time communication
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'speech-to-ai') {
          // Handle speech input and generate AI response
          const { text, conversationHistory } = message;
          
          const aiResponse = await generateResponse(text, conversationHistory || []);
          
          ws.send(JSON.stringify({
            type: 'ai-response',
            text: aiResponse,
            messageId: randomUUID(),
            timestamp: new Date().toISOString()
          }));
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message'
        }));
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    // Send connection confirmation
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'WebSocket connection established'
      }));
    }
  });

  return httpServer;
}
