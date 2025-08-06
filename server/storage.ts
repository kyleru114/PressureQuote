import { type User, type InsertUser, type Quote, type InsertQuote } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuote(id: string): Promise<Quote | undefined>;
  updateQuotePaymentStatus(id: string, stripePaymentIntentId: string): Promise<Quote>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quotes: Map<string, Quote>;

  constructor() {
    this.users = new Map();
    this.quotes = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = randomUUID();
    const quote: Quote = { 
      id,
      email: insertQuote.email,
      address: insertQuote.address,
      area: insertQuote.area,
      basePrice: insertQuote.basePrice,
      addons: insertQuote.addons as Array<{name: string, price: number}> || [],
      totalPrice: insertQuote.totalPrice,
      polygon: insertQuote.polygon as [number, number][],
      isPaid: false,
      stripePaymentIntentId: null,
      createdAt: new Date()
    };
    this.quotes.set(id, quote);
    return quote;
  }

  async getQuote(id: string): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }

  async updateQuotePaymentStatus(id: string, stripePaymentIntentId: string): Promise<Quote> {
    const quote = this.quotes.get(id);
    if (!quote) {
      throw new Error("Quote not found");
    }
    
    const updatedQuote: Quote = { 
      ...quote, 
      isPaid: true, 
      stripePaymentIntentId 
    };
    this.quotes.set(id, updatedQuote);
    return updatedQuote;
  }
}

export const storage = new MemStorage();
