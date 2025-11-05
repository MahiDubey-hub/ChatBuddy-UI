const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

let ws;

// connect to backend WebSocket
function connectWebSocket() {
  // For local backend — use ws://localhost:8080/chat
  ws = new WebSocket("https://chatbuddy-ux4z.onrender.com");

  ws.onopen = () => {
    console.log("Connected to WebSocket server");
  };

  ws.onmessage = (event) => {
    const msg = event.data;
    addMessage(msg, "bot");
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected. Reconnecting...");
    setTimeout(connectWebSocket, 3000);
  };
}

// Add chat bubbles
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  ws.send(text);
  input.value = "";
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

connectWebSocket();