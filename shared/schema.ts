import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  points: integer("points").notNull().default(0),
  level: text("level").notNull().default("Bronze Farmer"),
  rank: integer("rank").notNull().default(1),
  activeChallenges: integer("active_challenges").notNull().default(0),
});

export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  duration: integer("duration").notNull(), // in minutes
  points: integer("points").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
});

export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  progress: integer("progress").notNull().default(0), // percentage
  maxProgress: integer("max_progress").notNull().default(100),
  progressText: text("progress_text").notNull(),
  daysLeft: integer("days_left").notNull(),
  points: integer("points").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  userId: varchar("user_id").references(() => users.id),
});

export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  points: integer("points").notNull(),
  type: text("type").notNull(), // "badge", "voucher", "tool"
  icon: text("icon").notNull(),
  isUnlocked: boolean("is_unlocked").notNull().default(false),
  isRedeemed: boolean("is_redeemed").notNull().default(false),
});

export const marketPrices = pgTable("market_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  crop: text("crop").notNull(),
  price: text("price").notNull(),
  change: real("change").notNull(), // percentage change
  icon: text("icon").notNull(),
  category: text("category").notNull(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // "weather", "price", "tip", "reminder"
  icon: text("icon").notNull(),
  timeAgo: text("time_ago").notNull(),
  isRead: boolean("is_read").notNull().default(false),
});

export const leaderboard = pgTable("leaderboard", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  points: integer("points").notNull(),
  level: text("level").notNull(),
  rank: integer("rank").notNull(),
  isCurrentUser: boolean("is_current_user").notNull().default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true });
export const insertChallengeSchema = createInsertSchema(challenges).omit({ id: true });
export const insertRewardSchema = createInsertSchema(rewards).omit({ id: true });
export const insertMarketPriceSchema = createInsertSchema(marketPrices).omit({ id: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true });
export const insertLeaderboardSchema = createInsertSchema(leaderboard).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type MarketPrice = typeof marketPrices.$inferSelect;
export type InsertMarketPrice = z.infer<typeof insertMarketPriceSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardSchema>;
