import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard data
  app.get("/api/dashboard", async (req, res) => {
    try {
      const user = await storage.getUser("user-1"); // Default user for demo
      const challenges = await storage.getChallenges("user-1");
      const lessons = await storage.getLessons();
      const marketPrices = await storage.getMarketPrices();
      const leaderboard = await storage.getLeaderboard();
      const alerts = await storage.getAlerts();
      const rewards = await storage.getRewards();

      res.json({
        user,
        challenges: challenges.slice(0, 3), // Recent challenges
        lessons: lessons.slice(0, 3), // Recent lessons
        marketPrices: marketPrices.slice(0, 3), // Top market prices
        leaderboard: leaderboard.slice(0, 4), // Top 4 including current user
        alerts: alerts.slice(0, 4), // Recent alerts
        rewards: rewards.slice(0, 3) // Featured rewards
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Lessons endpoints
  app.get("/api/lessons", async (req, res) => {
    try {
      const lessons = await storage.getLessons();
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // Challenges endpoints
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getChallenges("user-1");
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const challenge = await storage.getChallenge(req.params.id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });

  app.post("/api/challenges/:id/submit-proof", async (req, res) => {
    try {
      const challengeId = req.params.id;
      const { proof } = req.body;
      
      if (!proof) {
        return res.status(400).json({ message: "Proof is required" });
      }

      const challenge = await storage.getChallenge(challengeId);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }

      // Update challenge progress (simulate proof submission)
      const updatedProgress = Math.min(challenge.progress + 20, 100);
      const updatedChallenge = await storage.updateChallenge(challengeId, {
        progress: updatedProgress
      });

      res.json({ 
        message: "Proof submitted successfully", 
        challenge: updatedChallenge 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit proof" });
    }
  });

  // Rewards endpoints
  app.get("/api/rewards", async (req, res) => {
    try {
      const rewards = await storage.getRewards();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rewards" });
    }
  });

  app.post("/api/rewards/:id/redeem", async (req, res) => {
    try {
      const rewardId = req.params.id;
      const userId = "user-1"; // Default user for demo
      
      const result = await storage.redeemReward(rewardId, userId);
      
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      
      res.json({ message: result.message });
    } catch (error) {
      res.status(500).json({ message: "Failed to redeem reward" });
    }
  });

  // Market endpoints
  app.get("/api/market", async (req, res) => {
    try {
      const marketPrices = await storage.getMarketPrices();
      const { category } = req.query;
      
      let filteredPrices = marketPrices;
      if (category && category !== "all") {
        filteredPrices = marketPrices.filter(price => price.category === category);
      }
      
      res.json(filteredPrices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  app.post("/api/market/transport-request", async (req, res) => {
    try {
      const { crop, quantity, location } = req.body;
      
      if (!crop || !quantity || !location) {
        return res.status(400).json({ message: "Crop, quantity, and location are required" });
      }

      // Simulate transport request
      res.json({ 
        message: `Transport request submitted for ${quantity} of ${crop} from ${location}`,
        requestId: `TR-${Date.now()}`,
        estimatedPickup: "Within 2-3 hours"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit transport request" });
    }
  });

  // Leaderboard endpoint
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Alerts endpoints
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts/:id/mark-read", async (req, res) => {
    try {
      await storage.markAlertAsRead(req.params.id);
      res.json({ message: "Alert marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
