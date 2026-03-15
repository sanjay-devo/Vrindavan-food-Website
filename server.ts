import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import Razorpay from "razorpay";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000; // Hardcoded per infrastructure rules

  app.use(express.json());
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
  }));

  // Initialize Firebase Admin
  const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
  let clientConfig: any = {};
  try {
    const fs = await import('fs');
    if (fs.existsSync(firebaseConfigPath)) {
      clientConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
    }
  } catch (e) {
    console.error("Error reading firebase-applet-config.json:", e);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || clientConfig.projectId;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey && clientEmail && projectId) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${projectId}.firebaseio.com`,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || clientConfig.storageBucket
      });
      console.log("Firebase Admin initialized successfully");
    } catch (error) {
      console.error("Firebase Admin initialization error:", error);
    }
  } else {
    const missing = [];
    if (!privateKey) missing.push("FIREBASE_PRIVATE_KEY");
    if (!clientEmail) missing.push("FIREBASE_CLIENT_EMAIL");
    if (!projectId) missing.push("FIREBASE_PROJECT_ID");
    console.warn(`Firebase Admin NOT initialized. Missing: ${missing.join(", ")}`);
  }

  // Initialize Razorpay
  let razorpay: Razorpay | null = null;
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("Razorpay initialized");
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", environment: process.env.NODE_ENV });
  });

  // Razorpay Order Creation
  app.post("/api/payments/order", async (req, res) => {
    if (!razorpay) {
      return res.status(500).json({ error: "Razorpay not configured" });
    }

    try {
      const { amount, currency = "INR", receipt } = req.body;
      const order = await razorpay.orders.create({
        amount: amount * 100, // amount in smallest currency unit
        currency,
        receipt,
      });
      res.json(order);
    } catch (error) {
      console.error("Razorpay order error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
