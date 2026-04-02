// dependencies
const express = require("express");
const cors = require("cors");
const checkAuth = require("./middlewares/cheackAuth");
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
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: false }));
// for rendering static files like css, js, images
app.use("/view", express.static("uploads"));
//dependency for session management

// routes
app.use(authRoutes);
app.use(checkAuth);
app.use(userRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use(notFoundMiddleware);
// internal server error handler
app.use(serverErrorMiddleware);

db.connect()
  .then(() => {
    app.listen(3000, () => {
      console.log("connected to database and started the server");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
  });
