
const socket = io();

let username = localStorage.getItem("username");

function askName() {
  let input = prompt("Enter your name");
  if (input && input.trim()) {
    username = input.trim();
    localStorage.setItem("username", username);
    socket.emit("setUsername", username);
  } else {
    askName();
  }
}

if (!username || username.trim() === "") {
  askName();
} else {
  socket.emit("setUsername", username);
}

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("message");
const chatBox = document.getElementById("chatBox");
const userList = document.getElementById("userList");
const changeNameBtn = document.getElementById("changeName");
const typingStatus = document.getElementById("typingStatus");
const userSelect = document.getElementById("userSelect");
const sound = new Audio("notify.mp3");

messageInput.focus();

let typingTimeout = null;

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = messageInput.value.trim();
  const to = userSelect.value || null;

  if (msg) {
    socket.emit("chatMessage", { message: msg, to });
    messageInput.value = "";
    messageInput.focus();
  }
});

messageInput.addEventListener("input", () => {
  socket.emit("typing", { to: userSelect.value || null, typing: true });
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit("typing", { to: userSelect.value || null, typing: false });
  }, 1000);
});

changeNameBtn.addEventListener("click", () => {
  askName();
});

document.getElementById("clearChat").addEventListener("click", () => {
  socket.emit("clearChat");
});

socket.on("loadMessages", (messages) => {
  messages.forEach(addMessage);
});

socket.on("message", (msg) => {
  addMessage(msg);
  sound.play();
});

socket.on("notify", (text) => {
  chatBox.innerHTML += `<div class="text-center text-warning mb-2">${text}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("typing", ({ from, typing }) => {
  typingStatus.textContent = typing ? `${from} is typing...` : "";
});

socket.on("activeUsers", (users) => {
  userList.innerHTML = users.map(u => `<li class="list-group-item bg-dark text-light border-secondary">${u}</li>`).join('');
  userSelect.innerHTML = '<option value="">All</option>' +
    users.filter(u => u !== username).map(u => `<option value="${u}">${u}</option>`).join('');
});

socket.on("chatCleared", () => {
  chatBox.innerHTML = "";
});

function addMessage({ from, to, message }) {
  const privateLabel = to ? '<span class="badge bg-info ms-2">Private</span>' : '';
  const bubble = `
    <div class="p-2 mb-1 rounded text-light" style="background-color:#333;">
      <strong>${from}</strong>${privateLabel}: ${message}
    </div>`;
  chatBox.innerHTML += bubble;
  chatBox.scrollTop = chatBox.scrollHeight;
}
