const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// POST /api/booking
router.post("/", async (req, res) => {
    try {
        const { name, phone, service, date, notes } = req.body;

        if (!name || !phone || !service || !date) {
            return res.status(400).json({ error: "Name, phone, service, and date are required." });
        }

        const newBooking = new Booking({ name, phone, service, date, notes });
        await newBooking.save();

        res.status(201).json({ success: true, message: "Booking received!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong. Please try again." });
    }
});

// GET /api/booking (for your future admin panel)
router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bookings." });
    }
});

module.exports = router;