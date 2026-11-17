import express from "express";
import cors from "cors";
import helmet from "helmet";
import requestRoutes from "./routes/requestRoutes.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // Allow tools such as curl/Postman which do not send an Origin header.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  }
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to MECH ON WHEELS API", health: "/api/health" });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "MECH ON WHEELS API",
    database: "connected"
  });
});

app.use("/api/requests", requestRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "API route not found." });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.message?.startsWith("CORS blocked")) {
    return res.status(403).json({ success: false, message: err.message });
  }
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ success: false, message: "Invalid JSON body." });
  }
  res.status(500).json({ success: false, message: "Internal server error." });
});

export default app;
