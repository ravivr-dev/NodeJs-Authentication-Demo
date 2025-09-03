require("dotenv").config();

const express = require("express");
const connectToDB = require("./database/db");
const authRoutes = require("./routes/AuthRoutes");
const homeRoutes = require("./routes/HomeRoutes");
const adminRoutes = require("./routes/AdminRoutes");
const uploadImageRoutes = require("./routes/ImageRoutes");

connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/home", homeRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/image", uploadImageRoutes);

app.use("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Authentication Route!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is now running on PORT ${PORT}`);
});
