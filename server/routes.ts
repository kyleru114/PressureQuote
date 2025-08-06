import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertQuoteSchema } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create a new quote
  app.post("/api/quotes", async (req, res) => {
    try {
      const validatedData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(validatedData);
      res.json(quote);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid quote data: " + error.message });
    }
  });

  // Get a quote by ID
  app.get("/api/quotes/:id", async (req, res) => {
    try {
      const quote = await storage.getQuote(req.params.id);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      res.json(quote);
    } catch (error: any) {
      res.status(500).json({ message: "Error retrieving quote: " + error.message });
    }
  });

  // Create Stripe payment intent
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, quoteId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Verify quote exists
      if (quoteId) {
        const quote = await storage.getQuote(quoteId);
        if (!quote) {
          return res.status(404).json({ message: "Quote not found" });
        }
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          quoteId: quoteId || '',
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Update quote payment status
  app.post("/api/quotes/:id/payment-success", async (req, res) => {
    try {
      const { stripePaymentIntentId } = req.body;
      const quote = await storage.updateQuotePaymentStatus(req.params.id, stripePaymentIntentId);
      res.json(quote);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating payment status: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
