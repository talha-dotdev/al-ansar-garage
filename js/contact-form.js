/*=========================================
CONTACT FORM — connects to backend API
=========================================*/

// Change this to your Render URL once deployed, e.g.
// const API_BASE = "https://al-ansar-backend.onrender.com";
const API_BASE = "http://localhost:5000";

const contactForm = document.getElementById("contactForm");
const statusEl = document.getElementById("cf-status");
const submitBtn = document.getElementById("cf-submit");

contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("cf-name").value.trim();
    const email = document.getElementById("cf-email").value.trim();
    const phone = document.getElementById("cf-phone").value.trim();
    const subject = document.getElementById("cf-service").value;
    const message = document.getElementById("cf-message").value.trim();

    if (!name || !email || !message) {
        statusEl.textContent = "Please fill in your name, email, and message.";
        statusEl.style.color = "var(--danger)";
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    statusEl.textContent = "";

    try {
        const res = await fetch(`${API_BASE}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, subject, message })
        });

        const data = await res.json();

        if (res.ok) {
            statusEl.textContent = "✅ Message sent! We'll get back to you shortly.";
            statusEl.style.color = "var(--success)";
            contactForm.reset();
        } else {
            statusEl.textContent = data.error || "Something went wrong. Please try again.";
            statusEl.style.color = "var(--danger)";
        }
    } catch (err) {
        statusEl.textContent = "Couldn't connect to the server. Please try again later.";
        statusEl.style.color = "var(--danger)";
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
    }
});