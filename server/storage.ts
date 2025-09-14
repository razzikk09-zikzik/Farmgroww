import { 
  type User, 
  type InsertUser, 
  type Lesson, 
  type InsertLesson,
  type Challenge,
  type InsertChallenge,
  type Reward,
  type InsertReward,
  type MarketPrice,
  type InsertMarketPrice,
  type Alert,
  type InsertAlert,
  type LeaderboardEntry,
  type InsertLeaderboardEntry
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Lesson methods
  getLessons(): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // Challenge methods
  getChallenges(userId?: string): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge | undefined>;

  // Reward methods
  getRewards(): Promise<Reward[]>;
  getReward(id: string): Promise<Reward | undefined>;
  redeemReward(id: string, userId: string): Promise<{ success: boolean; message: string }>;

  // Market methods
  getMarketPrices(): Promise<MarketPrice[]>;
  getMarketPrice(id: string): Promise<MarketPrice | undefined>;

  // Alert methods
  getAlerts(): Promise<Alert[]>;
  markAlertAsRead(id: string): Promise<void>;

  // Leaderboard methods
  getLeaderboard(): Promise<LeaderboardEntry[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private lessons: Map<string, Lesson> = new Map();
  private challenges: Map<string, Challenge> = new Map();
  private rewards: Map<string, Reward> = new Map();
  private marketPrices: Map<string, MarketPrice> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private leaderboard: Map<string, LeaderboardEntry> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed sample data
    this.seedUsers();
    this.seedLessons();
    this.seedChallenges();
    this.seedRewards();
    this.seedMarketPrices();
    this.seedAlerts();
    this.seedLeaderboard();
  }

  private seedUsers() {
    const defaultUser: User = {
      id: "user-1",
      username: "rajesh",
      password: "password123",
      name: "Rajesh Kumar",
      location: "Tamil Nadu",
      points: 850,
      level: "Silver Farmer",
      rank: 4,
      activeChallenges: 3
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  private seedLessons() {
    const sampleLessons: Lesson[] = [
      {
        id: "lesson-1",
        title: "Soil Health Basics",
        description: "Learn how to test and improve your soil quality for better crop yields",
        content: "Comprehensive guide to soil testing, pH management, and nutrient optimization...",
        duration: 5,
        points: 20,
        imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80",
        category: "soil"
      },
      {
        id: "lesson-2",
        title: "Pesticide Safety",
        description: "Safe application techniques and protective measures for chemical use",
        content: "Essential safety protocols for pesticide handling and application...",
        duration: 8,
        points: 30,
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80",
        category: "safety"
      },
      {
        id: "lesson-3",
        title: "Storage Methods",
        description: "Proper post-harvest storage to reduce losses and maintain quality",
        content: "Best practices for grain storage, pest control, and quality preservation...",
        duration: 6,
        points: 25,
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80",
        category: "storage"
      }
    ];

    sampleLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));
  }

  private seedChallenges() {
    const sampleChallenges: Challenge[] = [
      {
        id: "challenge-1",
        title: "Soil Test Week",
        description: "Complete soil testing on at least 3 different plots",
        progress: 40,
        maxProgress: 100,
        progressText: "2/5 plots",
        daysLeft: 4,
        points: 100,
        isActive: true,
        userId: "user-1"
      },
      {
        id: "challenge-2",
        title: "Pest-Free Plot",
        description: "Maintain one plot using only organic pest control methods",
        progress: 70,
        maxProgress: 100,
        progressText: "21/30 days",
        daysLeft: 9,
        points: 150,
        isActive: true,
        userId: "user-1"
      },
      {
        id: "challenge-3",
        title: "Water Conservation",
        description: "Implement drip irrigation system and track water usage",
        progress: 20,
        maxProgress: 100,
        progressText: "1/5 sections",
        daysLeft: 12,
        points: 200,
        isActive: true,
        userId: "user-1"
      }
    ];

    sampleChallenges.forEach(challenge => this.challenges.set(challenge.id, challenge));
  }

  private seedRewards() {
    const sampleRewards: Reward[] = [
      {
        id: "reward-1",
        title: "Soil Expert Badge",
        description: "Complete 5 soil challenges",
        points: 100,
        type: "badge",
        icon: "fas fa-certificate",
        isUnlocked: false,
        isRedeemed: false
      },
      {
        id: "reward-2",
        title: "₹500 Seed Voucher",
        description: "Valid at partner stores",
        points: 200,
        type: "voucher",
        icon: "fas fa-ticket-alt",
        isUnlocked: true,
        isRedeemed: false
      },
      {
        id: "reward-3",
        title: "Free Soil Test Kit",
        description: "Home delivery included",
        points: 150,
        type: "tool",
        icon: "fas fa-tools",
        isUnlocked: true,
        isRedeemed: false
      }
    ];

    sampleRewards.forEach(reward => this.rewards.set(reward.id, reward));
  }

  private seedMarketPrices() {
    const samplePrices: MarketPrice[] = [
      {
        id: "price-1",
        crop: "Rice",
        price: "₹1,800/qtl",
        change: 2.5,
        icon: "fas fa-seedling",
        category: "grains"
      },
      {
        id: "price-2",
        crop: "Tomato",
        price: "₹25/kg",
        change: 5.0,
        icon: "fas fa-apple-alt",
        category: "vegetables"
      },
      {
        id: "price-3",
        crop: "Banana",
        price: "₹40/kg",
        change: -1.2,
        icon: "fas fa-leaf",
        category: "fruits"
      }
    ];

    samplePrices.forEach(price => this.marketPrices.set(price.id, price));
  }

  private seedAlerts() {
    const sampleAlerts: Alert[] = [
      {
        id: "alert-1",
        title: "Weather Alert",
        message: "Heavy rainfall expected tomorrow. Protect young crops and ensure proper drainage.",
        type: "weather",
        icon: "fas fa-cloud-rain",
        timeAgo: "2 hours ago",
        isRead: false
      },
      {
        id: "alert-2",
        title: "Price Update",
        message: "Tomato prices increased by 5% in your area. Good time to sell!",
        type: "price",
        icon: "fas fa-chart-line",
        timeAgo: "5 hours ago",
        isRead: false
      },
      {
        id: "alert-3",
        title: "Farming Tip",
        message: "Apply neem oil spray in the evening for natural pest control.",
        type: "tip",
        icon: "fas fa-lightbulb",
        timeAgo: "1 day ago",
        isRead: false
      },
      {
        id: "alert-4",
        title: "Reminder",
        message: "Submit your Soil Test Week challenge proof by Friday.",
        type: "reminder",
        icon: "fas fa-calendar",
        timeAgo: "2 days ago",
        isRead: false
      }
    ];

    sampleAlerts.forEach(alert => this.alerts.set(alert.id, alert));
  }

  private seedLeaderboard() {
    const sampleLeaderboard: LeaderboardEntry[] = [
      {
        id: "leader-1",
        name: "Meena Devi",
        location: "Kerala",
        points: 1250,
        level: "Gold",
        rank: 1,
        isCurrentUser: false
      },
      {
        id: "leader-2",
        name: "Arjun Singh",
        location: "Tamil Nadu",
        points: 1100,
        level: "Silver",
        rank: 2,
        isCurrentUser: false
      },
      {
        id: "leader-3",
        name: "Priya Sharma",
        location: "Tamil Nadu",
        points: 980,
        level: "Bronze",
        rank: 3,
        isCurrentUser: false
      },
      {
        id: "leader-4",
        name: "Rajesh Kumar",
        location: "Tamil Nadu",
        points: 850,
        level: "Silver",
        rank: 4,
        isCurrentUser: true
      }
    ];

    sampleLeaderboard.forEach(entry => this.leaderboard.set(entry.id, entry));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      points: 0,
      level: "Bronze Farmer",
      rank: 1,
      activeChallenges: 0,
      ...insertUser, 
      id 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Lesson methods
  async getLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values());
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = randomUUID();
    const lesson: Lesson = { ...insertLesson, id };
    this.lessons.set(id, lesson);
    return lesson;
  }

  // Challenge methods
  async getChallenges(userId?: string): Promise<Challenge[]> {
    const challenges = Array.from(this.challenges.values());
    if (userId) {
      return challenges.filter(challenge => challenge.userId === userId);
    }
    return challenges;
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const challenge: Challenge = { 
      progress: 0,
      maxProgress: 100,
      isActive: true,
      userId: null,
      ...insertChallenge, 
      id 
    };
    this.challenges.set(id, challenge);
    return challenge;
  }

  async updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge | undefined> {
    const challenge = this.challenges.get(id);
    if (!challenge) return undefined;
    
    const updatedChallenge = { ...challenge, ...updates };
    this.challenges.set(id, updatedChallenge);
    return updatedChallenge;
  }

  // Reward methods
  async getRewards(): Promise<Reward[]> {
    return Array.from(this.rewards.values());
  }

  async getReward(id: string): Promise<Reward | undefined> {
    return this.rewards.get(id);
  }

  async redeemReward(id: string, userId: string): Promise<{ success: boolean; message: string }> {
    const reward = this.rewards.get(id);
    const user = this.users.get(userId);
    
    if (!reward) {
      return { success: false, message: "Reward not found" };
    }
    
    if (!user) {
      return { success: false, message: "User not found" };
    }
    
    if (!reward.isUnlocked) {
      return { success: false, message: "Reward is not unlocked yet" };
    }
    
    if (reward.isRedeemed) {
      return { success: false, message: "Reward already redeemed" };
    }
    
    if (user.points < reward.points) {
      return { success: false, message: "Insufficient points" };
    }
    
    // Deduct points and mark as redeemed
    const updatedUser = { ...user, points: user.points - reward.points };
    const updatedReward = { ...reward, isRedeemed: true };
    
    this.users.set(userId, updatedUser);
    this.rewards.set(id, updatedReward);
    
    return { success: true, message: "Reward redeemed successfully!" };
  }

  // Market methods
  async getMarketPrices(): Promise<MarketPrice[]> {
    return Array.from(this.marketPrices.values());
  }

  async getMarketPrice(id: string): Promise<MarketPrice | undefined> {
    return this.marketPrices.get(id);
  }

  // Alert methods
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }

  async markAlertAsRead(id: string): Promise<void> {
    const alert = this.alerts.get(id);
    if (alert) {
      this.alerts.set(id, { ...alert, isRead: true });
    }
  }

  // Leaderboard methods
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return Array.from(this.leaderboard.values()).sort((a, b) => a.rank - b.rank);
  }
}

export const storage = new MemStorage();
