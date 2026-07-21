require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const contactRoutes = require("./routes/contact");
const bookingRoutes = require("./routes/booking");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ---------- Serverless-safe MongoDB connection ----------
let isConnected = false;

async function connectDB() {
    if (isConnected) return;

    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
}

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err.message);
        res.status(500).json({ error: "Database connection failed." });
    }
});

app.get("/", (req, res) => {
    res.send("🚗 Backend + Database Connected!");
});

app.use("/api/contact", contactRoutes);
app.use("/api/booking", bookingRoutes);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
        connectDB();
    });
}

module.exports = app;
app.get("/api/dbtest", async (req, res) => {
    try {
        const state = mongoose.connection.readyState;
        // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
        res.json({ readyState: state, isConnected });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});