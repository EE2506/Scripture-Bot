require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const messageHandler = require('./handlers/messageHandler');
const scheduler = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Health check
app.get('/', (req, res) => {
  res.send('🙏 ScriptureBot is running!');
});

// Webhook verification (GET) - Meta sends this to verify your endpoint
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully!');
    res.status(200).send(challenge);
  } else {
    console.error('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

// Webhook message handler (POST) - Meta sends messages here
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    // Process each entry
    for (const entry of body.entry) {
      const event = entry.messaging[0];

      if (event.message && event.message.text) {
        await messageHandler.handleMessage(event);
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ScriptureBot server running on port ${PORT}`);
  console.log(`📖 Ready to serve the Word!`);

  // Initialize daily verse scheduler
  scheduler.initScheduler();
});

