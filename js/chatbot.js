/*=========================================
AL ANSAR GARAGE — CHATBOT WIDGET
Rule-based, no API key, no backend required.
Booking requests are handed off to WhatsApp
(pre-filled message) and/or email.

>>> EDIT THE CONFIG BLOCK BELOW WITH YOUR
>>> REAL BUSINESS DETAILS BEFORE GOING LIVE.
=========================================*/

const CB_CONFIG = {
    businessName: "Al Ansar Garage",
    // WhatsApp number in international format, no + or spaces (used for wa.me links)
    whatsappNumber: "971XXXXXXXXX",
    phoneDisplay: "+971 XX XXX XXXX",
    email: "info@alansargarage.com",
    hours: "Sat - Thu, 8:00 AM - 8:00 PM",
    location: "Ajman Industrial Area, Ajman, UAE",
    mapsLink: "https://maps.google.com/?q=Ajman+Industrial+Area+Ajman+UAE",
    services: [
        { name: "Engine Repair", desc: "Engine diagnostics, suspension, brake systems and complete mechanical maintenance." },
        { name: "Electrical Work", desc: "Advanced electrical diagnostics, battery replacement, wiring and ECU solutions." },
        { name: "AC Service", desc: "Complete air-conditioning inspection, gas refill, compressor repair and cooling." },
        { name: "Body Painting", desc: "Premium dent repair, color matching, polishing and body restoration." }
    ]
};

(function () {
    "use strict";

    // ---------- Inject widget markup ----------
    const root = document.createElement("div");
    root.innerHTML = `
        <button class="chatbot-toggle" id="cbToggle" aria-label="Open chat">
            <i class="fa-solid fa-comment-dots" id="cbToggleIcon"></i>
            <span class="cb-badge" id="cbBadge">1</span>
        </button>
        <div class="chatbot-window" id="cbWindow" role="dialog" aria-label="${CB_CONFIG.businessName} chat assistant">
            <div class="cb-header">
                <div class="cb-header-info">
                    <div class="cb-avatar"><i class="fa-solid fa-wrench"></i></div>
                    <div>
                        <h4>${CB_CONFIG.businessName}</h4>
                        <span>Usually replies instantly</span>
                    </div>
                </div>
                <button class="cb-close" id="cbClose" aria-label="Close chat">&times;</button>
            </div>
            <div class="cb-messages" id="cbMessages"></div>
            <div class="cb-input-row">
                <input type="text" id="cbInput" placeholder="Type a message..." autocomplete="off">
                <button id="cbSend" aria-label="Send"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    document.body.appendChild(root);

    // ---------- Element refs ----------
    const toggleBtn = document.getElementById("cbToggle");
    const toggleIcon = document.getElementById("cbToggleIcon");
    const badge = document.getElementById("cbBadge");
    const win = document.getElementById("cbWindow");
    const closeBtn = document.getElementById("cbClose");
    const messages = document.getElementById("cbMessages");
    const input = document.getElementById("cbInput");
    const sendBtn = document.getElementById("cbSend");

    let isOpen = false;
    let hasGreeted = false;

    // Booking flow state
    let booking = null; // { step, name, phone, service, date, notes }

    // ---------- Core UI helpers ----------
    function scrollToBottom() {
        messages.scrollTop = messages.scrollHeight;
    }

    function addBotMessage(html) {
        const el = document.createElement("div");
        el.className = "cb-msg bot";
        el.innerHTML = html;
        messages.appendChild(el);
        scrollToBottom();
    }

    function addUserMessage(text) {
        const el = document.createElement("div");
        el.className = "cb-msg user";
        el.textContent = text;
        messages.appendChild(el);
        scrollToBottom();
    }

    function showTyping(callback, delay) {
        const el = document.createElement("div");
        el.className = "cb-typing";
        el.id = "cbTyping";
        el.innerHTML = "<span></span><span></span><span></span>";
        messages.appendChild(el);
        scrollToBottom();
        setTimeout(() => {
            const t = document.getElementById("cbTyping");
            if (t) t.remove();
            callback();
        }, delay || 550);
    }

    function addQuickReplies(options) {
        const wrap = document.createElement("div");
        wrap.className = "cb-quick-replies";
        options.forEach(opt => {
            const chip = document.createElement("button");
            chip.className = "cb-chip";
            chip.textContent = opt.label;
            chip.addEventListener("click", () => {
                wrap.remove();
                addUserMessage(opt.label);
                showTyping(() => opt.action());
            });
            wrap.appendChild(chip);
        });
        messages.appendChild(wrap);
        scrollToBottom();
    }

    // ---------- Main menu ----------
    function showMainMenu() {
        addBotMessage("What would you like to know?");
        addQuickReplies([
            { label: "Our Services", action: showServices },
            { label: "Working Hours", action: showHours },
            { label: "Location", action: showLocation },
            { label: "Book an Appointment", action: startBooking },
            { label: "Talk to a Human", action: showHumanContact }
        ]);
    }

    function showServices() {
        let html = "<strong>We offer:</strong><br>";
        CB_CONFIG.services.forEach(s => {
            html += `<br>🔧 <strong>${s.name}</strong><br>${s.desc}<br>`;
        });
        addBotMessage(html);
        showTyping(() => {
            addBotMessage("Want to book one of these?");
            addQuickReplies([
                { label: "Book an Appointment", action: startBooking },
                { label: "Back to Menu", action: showMainMenu }
            ]);
        }, 400);
    }

    function showHours() {
        addBotMessage(`We're open <strong>${CB_CONFIG.hours}</strong>.`);
        showTyping(() => {
            addQuickReplies([
                { label: "Book an Appointment", action: startBooking },
                { label: "Back to Menu", action: showMainMenu }
            ]);
        }, 350);
    }

    function showLocation() {
        addBotMessage(`We're located at <strong>${CB_CONFIG.location}</strong>.<br><a href="${CB_CONFIG.mapsLink}" target="_blank" rel="noopener">Open in Google Maps →</a>`);
        showTyping(() => {
            addQuickReplies([{ label: "Back to Menu", action: showMainMenu }]);
        }, 350);
    }

    function showHumanContact() {
        addBotMessage(
            `You can reach our team directly:<br><br>` +
            `📞 <a href="tel:+${CB_CONFIG.whatsappNumber}">${CB_CONFIG.phoneDisplay}</a><br>` +
            `💬 <a href="https://wa.me/${CB_CONFIG.whatsappNumber}" target="_blank" rel="noopener">WhatsApp us</a><br>` +
            `✉️ <a href="mailto:${CB_CONFIG.email}">${CB_CONFIG.email}</a>`
        );
        showTyping(() => {
            addQuickReplies([{ label: "Back to Menu", action: showMainMenu }]);
        }, 350);
    }

    // ---------- Booking flow ----------
    function startBooking() {
        booking = { step: "name" };
        addBotMessage("Great — let's get your vehicle booked in. What's your <strong>full name</strong>?");
    }

    function handleBookingStep(text) {
        switch (booking.step) {
            case "name":
                booking.name = text;
                booking.step = "phone";
                showTyping(() => addBotMessage(`Thanks, ${escapeHtml(text)}! What's the best <strong>phone number</strong> to reach you on?`));
                return;

            case "phone":
                booking.phone = text;
                booking.step = "service";
                showTyping(() => {
                    addBotMessage("Which service do you need?");
                    addQuickReplies(CB_CONFIG.services.map(s => ({
                        label: s.name,
                        action: () => handleServiceChoice(s.name)
                    })));
                });
                return;

            case "date":
                booking.date = text;
                booking.step = "notes";
                showTyping(() => addBotMessage("Any details about your vehicle or the issue? (or type \"none\")"));
                return;

            case "notes":
                booking.notes = text;
                showTyping(() => finishBooking());
                return;
        }
    }

    function handleServiceChoice(serviceName) {
        booking.service = serviceName;
        booking.step = "date";
        showTyping(() => addBotMessage("What day works best for you? (e.g. \"Tomorrow\" or a date)"));
    }

    function finishBooking() {
        const summary =
            `<strong>Here's your booking summary:</strong><br><br>` +
            `👤 ${escapeHtml(booking.name)}<br>` +
            `📞 ${escapeHtml(booking.phone)}<br>` +
            `🔧 ${escapeHtml(booking.service)}<br>` +
            `📅 ${escapeHtml(booking.date)}<br>` +
            `📝 ${escapeHtml(booking.notes)}`;
        addBotMessage(summary);

        const waText = encodeURIComponent(
            `Hi Al Ansar Garage, I'd like to book a service.\n` +
            `Name: ${booking.name}\n` +
            `Phone: ${booking.phone}\n` +
            `Service: ${booking.service}\n` +
            `Preferred date: ${booking.date}\n` +
            `Notes: ${booking.notes}`
        );
        const waLink = `https://wa.me/${CB_CONFIG.whatsappNumber}?text=${waText}`;
        const mailLink = `mailto:${CB_CONFIG.email}?subject=${encodeURIComponent("Service Booking - " + booking.name)}&body=${waText}`;

        showTyping(() => {
            addBotMessage(
                `Tap below to send this to our team and confirm your slot:<br><br>` +
                `<a href="${waLink}" target="_blank" rel="noopener">✅ Send via WhatsApp</a><br><br>` +
                `<a href="${mailLink}">✉️ Send via Email instead</a>`
            );
            showTyping(() => {
                addQuickReplies([{ label: "Back to Menu", action: showMainMenu }]);
            }, 400);
        }, 500);

        booking = null;
    }

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    // ---------- Free-text input handling ----------
    function handleUserText(text) {
        if (!text.trim()) return;
        addUserMessage(text);
        input.value = "";

        showTyping(() => {
            if (booking) {
                handleBookingStep(text);
                return;
            }

            const lower = text.toLowerCase();
            if (/(book|appointment|schedule)/.test(lower)) {
                startBooking();
            } else if (/(hour|time|open|close)/.test(lower)) {
                showHours();
            } else if (/(where|location|address|map)/.test(lower)) {
                showLocation();
            } else if (/(service|engine|electrical|ac\b|paint|repair)/.test(lower)) {
                showServices();
            } else if (/(call|phone|whatsapp|human|contact|email)/.test(lower)) {
                showHumanContact();
            } else {
                addBotMessage("I'm not sure I caught that — here are some things I can help with:");
                addQuickReplies([
                    { label: "Our Services", action: showServices },
                    { label: "Working Hours", action: showHours },
                    { label: "Book an Appointment", action: startBooking },
                    { label: "Talk to a Human", action: showHumanContact }
                ]);
            }
        });
    }

    // ---------- Open / close ----------
    function openChat() {
        isOpen = true;
        win.classList.add("open");
        toggleIcon.className = "fa-solid fa-xmark";
        badge.style.display = "none";
        if (!hasGreeted) {
            hasGreeted = true;
            showTyping(() => {
                addBotMessage(`👋 Hi! Welcome to <strong>${CB_CONFIG.businessName}</strong>. How can I help you today?`);
                showMainMenu();
            }, 500);
        }
    }

    function closeChat() {
        isOpen = false;
        win.classList.remove("open");
        toggleIcon.className = "fa-solid fa-comment-dots";
    }

    toggleBtn.addEventListener("click", () => (isOpen ? closeChat() : openChat()));
    closeBtn.addEventListener("click", closeChat);
    sendBtn.addEventListener("click", () => handleUserText(input.value));
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleUserText(input.value);
    });
})();
