const API_KEY = "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"; // ← Ganti API KEY kamu di sini!
const input = document.getElementById("input");
const chatBox = document.getElementById("chat-box");
const modeSelect = document.getElementById("mode");
const themeBtn = document.getElementById("toggle-theme");
const body = document.body;
const tools = document.getElementById("tools");
const vol = document.getElementById("vol");
const pitch = document.getElementById("pitch");
const rate = document.getElementById("rate");

let userName = "";

function appendMessage(text, isUser, isImage = false) {
  const msg = document.createElement("div");
  msg.className = `chat ${isUser ? "user" : "ai"} ${body.className}`;
  msg.innerHTML = isImage ? `<img src="${text}" class="generated">` : "";

  if (!isImage) {
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        msg.innerHTML += text.charAt(i++);
        setTimeout(typeChar, 15);
      } else if (!isUser) {
        speak(text);
        showQuickReplies(text);
      }
    }
    typeChar();
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  saveChat();
}

function showQuickReplies(text) {
  const quick = document.createElement("div");
  quick.className = "quick";
  quick.innerHTML = `
    <button onclick="sendQuick('Lanjutkan')">Lanjutkan</button>
    <button onclick="sendQuick('Ulangi penjelasan')">Ulangi</button>
    <button onclick="sendQuick('Buat lebih detail')">Lebih detail</button>`;
  chatBox.appendChild(quick);
}

function sendQuick(msg) {
  input.value = msg;
  sendMessage();
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.volume = parseFloat(vol.value);
  utter.pitch = parseFloat(pitch.value);
  utter.rate = parseFloat(rate.value);
  speechSynthesis.speak(utter);
}

function buildPrompt(userInput) {
  const mode = modeSelect.value;
  switch (mode) {
    case "nulis": return `Tolong bantu tulis: ${userInput}`;
    case "hitung": return `Hitung ini: ${userInput}`;
    case "translate": return `Terjemahkan ke bahasa Inggris: ${userInput}`;
    default: return userInput;
  }
}

async function sendMessage() {
    const userInput = input.value.trim();
    if (!userInput) return;
    appendMessage(`${userName || "User"}: ${userInput}`, true);
    input.value = "";
  
    try {
      // Image generation request
      if (userInput.startsWith("#gambar")) {
        const prompt = userInput.replace("#gambar", "").trim();
        const res = await fetch("https://gemini.google.com/app?hl=id", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ prompt, n: 1, size: "512x512" })
        });
        if (!res.ok) throw new Error("Failed to generate image");
        const data = await res.json();
        appendMessage(data.data[0].url, false, true);
        return;
      }
  
      // Chat completion request
      const prompt = buildPrompt(userInput);
      const res = await fetch("https://gemini.google.com/app?hl=id", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }]
        })
      });
  
      if (!res.ok) throw new Error("Failed to get chat response");
      const data = await res.json();
      if (data.choices && data.choices[0]) {
        const aiText = data.choices[0].message.content;
        appendMessage(aiText, false);
      } else {
        appendMessage("⚠️ Gagal mendapatkan jawaban. Coba lagi nanti.", false);
        console.error("API error:", data);
      }
    } catch (error) {
      appendMessage(`⚠️ Error: ${error.message}`, false);
      console.error("Error occurred:", error);
    }
  }

async function sendMessage() {
  const userInput = input.value.trim();
  if (!userInput) return;
  appendMessage(`${userName || "User"}: ${userInput}`, true);
  input.value = "";

  if (userInput.startsWith("#gambar")) {
    const prompt = userInput.replace("#gambar", "").trim();
    const res = await fetch("https://gemini.google.com/app?hl=id", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt, n: 1, size: "512x512" })
    });
    const data = await res.json();
    appendMessage(data.data[0].url, false, true);
    return;
  }

  const prompt = buildPrompt(userInput);
  const res = await fetch("https://gemini.google.com/app?hl=id", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
if (data.choices && data.choices[0]) {
  const aiText = data.choices[0].message.content;
  appendMessage(aiText, false);
} else {
  appendMessage("⚠️ Gagal mendapatkan jawaban. Coba lagi nanti.", false);
  console.error("API error:", data);
}
}

function startVoice() {
  const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  rec.lang = "id-ID";
  rec.start();
  rec.onresult = e => {
    input.value = e.results[0][0].transcript;
  };
}

function toggleTheme() {
  const current = body.className === "dark" ? "light" : "dark";
  body.className = current;
  tools.className = current;
  document.querySelector("header").className = current;
  document.querySelector("footer").className = current;
  themeBtn.textContent = current === "dark" ? "🌞" : "🌙";
  localStorage.setItem("theme", current);
}
themeBtn.onclick = toggleTheme;

function saveChat() {
  localStorage.setItem("chat", chatBox.innerHTML);
}
function clearChat() {
  chatBox.innerHTML = "";
  localStorage.removeItem("chat");
}
function exportChat() {
  const blob = new Blob([chatBox.innerText], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "digi-chat.txt";
  a.click();
}
function importChat() {
  const file = document.getElementById("importChat").files[0];
  const reader = new FileReader();
  reader.onload = e => {
    chatBox.innerText = e.target.result;
    saveChat();
  };
  reader.readAsText(file);
}
function saveUser() {
  const name = document.getElementById("username").value.trim();
  if (name) {
    userName = name;
    alert(`Halo, ${userName}!`);
  }
}

window.onload = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  body.className = savedTheme;
  tools.className = savedTheme;
  document.querySelector("header").className = savedTheme;
  document.querySelector("footer").className = savedTheme;
  themeBtn.textContent = savedTheme === "dark" ? "🌞" : "🌙";

  const saved = localStorage.getItem("chat");
  if (saved) chatBox.innerHTML = saved;
};
