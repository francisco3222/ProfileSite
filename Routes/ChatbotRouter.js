const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
require('dotenv').config();

router.post('/api/chat', async (req, res) => {
    const start = Date.now();
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('[chat] OPENAI_API_KEY not set, request denied');
            return res.status(500).json({ error: 'Server configuration error: OPENAI_API_KEY not set' });
        }

        const { message } = req.body || {};
        console.log(`[chat] request from ${req.ip} body:`, { message: message ? '<present>' : '<missing>' });

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Invalid message' });
        }

        const openai = new OpenAI({ apiKey });

        const systemPrompt = `You are Xico, a friendly assistant representing Francisco Henriques. Keep answers concise and helpful.`;

        // Use the SDK method available in your installed version; adjust if different.
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            temperature: 0.25,
            max_tokens: 400
        });

        const reply = completion?.choices?.[0]?.message?.content?.trim() || 'Sorry, something went wrong with the chat service.';
        const duration = Date.now() - start;
        console.log(`[chat] reply sent (${duration}ms)`);
        return res.json({ reply });
    } catch (err) {
        // If OpenAI SDK provides response details, log them.
        console.error('[chat] error:', err?.message || err);
        if (err?.response?.status) {
            console.error('[chat] openai response status:', err.response.status, err.response.data || '');
        }
        return res.status(500).json({ error: 'Chat service error' });
    }
});

module.exports = router;