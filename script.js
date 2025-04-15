const API_KEY = "YOUR_OPENAI_API_KEY"; // Ganti dengan API Key kamu

const sendButton = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Fungsi untuk mengubah tema ke Dark/Light mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    chatBox.classList.toggle("dark-mode");
}

// Fungsi untuk menambahkan pesan ke chat
function appendMessage(message, isUser = true) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    if (isUser) {
        messageElement.style.textAlign = "right";
    }
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fungsi untuk mengirim pesan ke API OpenAI
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    appendMessage(`User: ${userMessage}`, true);
    userInput.value = "";

    try {
        const prompt = `User: ${userMessage}\nAI:`;

        // Permintaan ke OpenAI API
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
            }),
        });

        if (res.status === 429) {
            appendMessage("⚠️ Terlalu banyak permintaan, coba lagi beberapa saat.", false);
            return;
        }

        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }

        const data = await res.json();
        const aiMessage = data.choices[0].message.content;
        appendMessage(`AI: ${aiMessage}`, false);
    } catch (error) {
        console.error("Error fetching data:", error);
        appendMessage("⚠️ Terjadi kesalahan. Coba lagi.", false);
    }
}

// Event listener untuk tombol kirim
sendButton.addEventListener("click", sendMessage);

// Menangani tekan tombol Enter untuk mengirim pesan
userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// Fitur dark mode toggle
document.addEventListener("keydown", function (e) {
    if (e.key === "d" || e.key === "D") {
        toggleDarkMode();
    }
});
