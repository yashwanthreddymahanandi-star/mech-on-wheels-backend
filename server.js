import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGO_URI) {
    console.error("ERROR: MONGO_URI is missing. Create backend/.env and add your MongoDB connection string.");
    process.exit(1);
  }

  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`MECH ON WHEELS API running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Closing server...`);
      server.close(async () => {
        const mongoose = await import("mongoose");
        await mongoose.default.connection.close();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Check MONGO_URI, Atlas Network Access, database username/password, and internet connection.");
    process.exit(1);
  }
}

startServer();
