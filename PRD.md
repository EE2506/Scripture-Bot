# Project Document: ScriptureBot for Messenger

## 1. Product Requirements Document (PRD)

### 1.1 Project Overview
**ScriptureBot** is an automated Facebook Messenger chatbot designed for group chats. It integrates the **API.bible** platform to provide instant scripture retrieval, helping users share and discuss biblical texts seamlessly.

### 1.2 Tech Stack & Infrastructure
* **Runtime Environment:** Node.js (Express.js framework).
* **External APIs:** * [API.bible](https://docs.api.bible/) (Scripture data)
    * [Meta Graph API](https://developers.facebook.com/) (Messenger messaging)
* **Development Tools:** Antigravity IDE (Claude/Gemini models), ngrok (Local tunneling).
* **Hosting/Deployment:** Render or Zeabur (Cloud-based).

### 1.3 Key Features
* **Command Parsing:** Recognizes triggers like `/bible [Reference]` or `/search [Keyword]`.
* **Smart Retrieval:** Fetches specific verses or chapters from the API.
* **Group Chat Compatibility:** Responds directly to the thread where the command was issued.
* **Webhook Verification:** Secure handshake with Meta's servers.

### 1.4 Success Metrics
* **Response Time:** Under 2 seconds from command to reply.
* **Reliability:** 24/7 uptime using cloud deployment.

# Implementation Roadmap

### Phase 1: Local setup
1.  Initialize the project: `npm init -y`.
2.  Install dependencies: `npm install express axios dotenv body-parser`.
3.  Run the Antigravity prompt and save files.
4.  Start **ngrok** on port 3000: `ngrok http 3000`.

### Phase 2: Meta Configuration
1.  Create a "Messenger" app on **Meta for Developers**.
2.  Add the **ngrok** URL to the Webhook settings.
3.  Subscribe to the `messages` and `messaging_postbacks` events.

### Phase 3: Online Deployment
1.  Push code to **GitHub**.
2.  Connect GitHub to **Render**.
3.  Update the Webhook URL in Meta Dashboard to the new Render URL (e.g., `https://scripture-bot.onrender.com/webhook`).