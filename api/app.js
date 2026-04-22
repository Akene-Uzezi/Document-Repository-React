// dependencies
const express = require("express");
const cors = require("cors");
const checkAuth = require("./middlewares/cheackAuth");
require("dotenv").config();
//middlewares
const notFoundMiddleware = require("./middlewares/not-found");
const serverErrorMiddleware = require("./middlewares/server-error");
//session configuration
//routes
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
//database connection
const db = require("./database/documentRepository.db");
const app = express();
// enable CORS for all routes
const CLIENT_URL = process.env.frontend || "http://localhost:5173";
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    // allow the configured client
    if (origin === CLIENT_URL) return callback(null, true);
    // otherwise block
    return callback(new Error("Not allowed by CORS"), false);
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));

// middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: false }));

// routes
app.use(authRoutes);
app.use(checkAuth);
app.use(userRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use(notFoundMiddleware);
// internal server error handler
app.use(serverErrorMiddleware);

// Replace with your actual Render URL
const API_URL = process.env.endpoint;

const startKeepAlive = () => {
  // 600000ms = 10 minutes
  setInterval(async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        console.log(`Keep-alive success: ${response.status}`);
      }
    } catch (error) {
      console.error("Keep-alive failed:", error.message);
    }
  }, 600000);
};

// Start the loop
startKeepAlive();

const PORT = process.env.PORT || 3000;

const setUpIndexes = async (database) => {
  console.log("initializing database indexes...");
  const uploads = database.collection("uploads");
  await uploads.createIndex({ user: 1 });
  await uploads.createIndex({ sharedWith: 1 });
  await uploads.createIndex({ user: 1, _id: -1 });

  const users = database.collection("users");
  await users.createIndex({ email: 1 }, { unique: true });
  console.log("Indexes created successfully");
};

db.connect()
  .then(async () => {
    try {
      const database = db.getDb();

      // Call the consolidated indexing function
      await setUpIndexes(database);

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server started on port ${PORT}`);
      });
    } catch (err) {
      console.error("Database initialization failed:", err);
      process.exit(1); // Exit if critical indexes fail
    }
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
  });
