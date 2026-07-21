const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");
const verifyToken = require("../middleware/auth");

// POST /api/contact
router.post("/", async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "Name, email, and message are required." });
        }

        const newMessage = new ContactMessage({ name, email, phone, subject, message });
        await newMessage.save();

        res.status(201).json({ success: true, message: "Message received!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong. Please try again." });
    }
});

// GET /api/contact (for your future admin panel)
router.get("/", verifyToken, async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch messages." });
    }
});

module.exports = router;