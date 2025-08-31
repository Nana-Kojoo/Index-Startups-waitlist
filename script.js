
  // Supabase keys
  const SUPABASE_URL = "https://ldoekltwzkwualegkvjz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkb2VrbHR3emt3dWFsZWdrdmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MDc1MjMsImV4cCI6MjA3MjE4MzUyM30.QHYz_L9Yi_x18_DKyFxeZ9DPqPVD_WrlNbIuPeaFoIg";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Telegram bot details
  const TELEGRAM_BOT_TOKEN = "8222537850:AAHPTzZATGWo6OWxGSCI9DKU-nrqY4opflE";
  const TELEGRAM_CHAT_ID = "6003493857"; // your user ID

  // Popup handler
  function showPopup(message, type = "success") {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.className = `popup ${type} show`;
    popup.style.display = "block"; // make sure it shows

    setTimeout(() => {
      popup.classList.remove("show");
      setTimeout(() => (popup.style.display = "none"), 300);
    }, 3000);
  }

  // Send Telegram alert
  async function sendTelegramNotification(email) {
    const message = `📩 New waitlist signup: ${email}`;
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message
      })
    });
  }

  // Form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const email = event.target.querySelector("input").value.trim();

    if (!email) {
      showPopup("⚠️ Please enter a valid email.", "error");
      return;
    }

    const { data, error } = await supabase
      .from("waitlist")
      .insert([{ email }]);

    if (error) {
      if (error.code === "23505") {
        showPopup("⚠️ This email is already on the waitlist.", "error");
      } else {
        console.error(error);
        showPopup("❌ Something went wrong. Try again later.", "error");
      }
    } else {
      showPopup(`🎉 Thanks for joining the waitlist, ${email}!`, "success");
      event.target.reset();
      sendTelegramNotification(email); // send Telegram alert
    }
  }

