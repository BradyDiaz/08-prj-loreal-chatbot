const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const messages = [
  {
    role: "system",
    content:
      "You are a helpful assistant for L’Oréal. You only answer questions related to L’Oréal makeup products, beauty routines involving makeup, product recommendations, and makeup application tips. You politely refuse to answer anything outside of those topics.",
  },
];

// Add a message bubble with label
function appendMessage(sender, text, isLoading = false) {
  const wrapper = document.createElement("div");
  wrapper.className = `msg ${sender}`;

  const label = document.createElement("div");
  label.className = "sender";
  label.textContent = sender === "user" ? "You" : "L’Oréal Chatbot";
  wrapper.appendChild(label);

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  wrapper.appendChild(bubble);

  if (isLoading) wrapper.classList.add("loading");

  chatWindow.appendChild(wrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  return wrapper; // return so we can delete it later if needed
}

// Initial greeting
appendMessage(
  "ai",
  "👋 Hi! I’m the L’Oréal Chatbot. Ask me about makeup products, beauty tips, or how to use L’Oréal cosmetics!"
);

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage("user", input);
  userInput.value = "";

  messages.push({ role: "user", content: input });

  // Add loading message
  const loadingEl = appendMessage("ai", "L’Oréal Chatbot is typing...", true);

  try {
    const response = await fetch(
      "https://loreal-chattin.bradydiaz13.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
        }),
      }
    );

    const data = await response.json();
    const reply = data.choices[0].message.content;
    messages.push({ role: "assistant", content: reply });

    // Remove loading and add actual response
    loadingEl.remove();
    appendMessage("ai", reply);
  } catch (err) {
    loadingEl.remove();
    appendMessage("ai", "⚠️ Something went wrong. Try again soon.");
    console.error(err);
  }
});
