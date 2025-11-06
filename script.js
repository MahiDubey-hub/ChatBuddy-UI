const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

const statusDiv = document.createElement("div");
statusDiv.id = "connection-status";
statusDiv.style.textAlign = "center";
statusDiv.style.padding = "8px";
statusDiv.style.fontWeight = "bold";
statusDiv.style.color = "#fff";
statusDiv.style.backgroundColor = "#555";
statusDiv.textContent = "Connecting...";
chatBox.parentNode.insertBefore(statusDiv, chatBox);

let ws;

// connect to backend WebSocket
function connectWebSocket() {
  
  statusDiv.textContent = "Connecting...";
  statusDiv.style.backgroundColor = "#7196dbff";

  ws = new WebSocket("wss://chatbuddy-ux4z.onrender.com/chat");

  ws.onopen = () => {
    console.log("Connected to WebSocket server");
    statusDiv.textContent = "Connected";
    statusDiv.style.backgroundColor = "#58ae6cff";
  };

  ws.onmessage = (event) => {
    const msg = event.data;
    addMessage(msg, "bot");
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected. Reconnecting...");
    setTimeout(connectWebSocket, 3000);
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    statusDiv.textContent = "Error in connection. Please try again later.";
    statusDiv.style.backgroundColor = "#cc7f7fff"; // yellow
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