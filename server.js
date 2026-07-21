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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("❌ MongoDB Connection Failed");
    console.log(err.message);
});

app.get("/", (req, res) => {
    res.send("🚗 Backend + Database Connected!");
});

app.use("/api/contact", contactRoutes);
app.use("/api/booking", bookingRoutes);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;