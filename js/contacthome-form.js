/*=========================================
HOME PAGE BOOKING FORM — connects to backend API
=========================================*/

const HOME_API_BASE = "http://localhost:5000"; // change to Render URL once deployed

const homeContactForm = document.getElementById("homeContactForm");
const hcfStatus = document.getElementById("hcf-status");
const hcfSubmit = document.getElementById("hcf-submit");

homeContactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("hcf-name").value.trim();
    const email = document.getElementById("hcf-email").value.trim();
    const phone = document.getElementById("hcf-phone").value.trim();
    const subject = document.getElementById("hcf-service").value;
    const message = document.getElementById("hcf-message").value.trim();

    if (!name || !email || !message) {
        hcfStatus.textContent = "Please fill in your name, email, and message.";
        hcfStatus.style.color = "var(--danger)";
        return;
    }

    hcfSubmit.disabled = true;
    hcfSubmit.textContent = "Sending...";
    hcfStatus.textContent = "";

    try {
        const res = await fetch(`${HOME_API_BASE}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, subject, message })
        });

        const data = await res.json();

        if (res.ok) {
            hcfStatus.textContent = "✅ Request sent! We'll get back to you shortly.";
            hcfStatus.style.color = "var(--success)";
            homeContactForm.reset();
        } else {
            hcfStatus.textContent = data.error || "Something went wrong. Please try again.";
            hcfStatus.style.color = "var(--danger)";
        }
    } catch (err) {
        hcfStatus.textContent = "Couldn't connect to the server. Please try again later.";
        hcfStatus.style.color = "var(--danger)";
    } finally {
        hcfSubmit.disabled = false;
        hcfSubmit.textContent = "Book Appointment";
    }
});