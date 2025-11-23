(function () {
    const btn = document.getElementById('chatbotButton');
    const box = document.getElementById('chatbotBox');
    const closeBtn = document.getElementById('chatbotClose');
    const messages = document.getElementById('chatbotMessages');
    const form = document.getElementById('chatbotForm');
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');

    if (!btn || !box || !messages || !form || !input || !sendBtn) return;

    const langData = {
        welcome: box.dataset.welcome || 'Hello! I am Xico — ask me about Francisco.',
        placeholder: box.dataset.placeholder || 'Type your message...',
        send: box.dataset.send || 'Send'
    };

    function sanitize(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function appendMessage(text, who) {
        const el = document.createElement('div');
        el.className = 'chatbot-message ' + (who === 'user' ? 'user' : 'bot');
        el.innerHTML = sanitize(text);
        messages.appendChild(el);
        messages.scrollTop = messages.scrollHeight;
    }

    function setAriaHidden(hidden) {
        box.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    }

    function showBox() {
        box.classList.remove('hidden');
        box.classList.add('visible');
        setAriaHidden(false);
        input.focus();
        if (!box.dataset._welcomed) {
            appendMessage(langData.welcome, 'bot');
            box.dataset._welcomed = '1';
        }
    }

    function hideBox() {
        box.classList.remove('visible');
        box.classList.add('hidden');
        setAriaHidden(true);
    }

    function toggleBox() {
        if (box.classList.contains('visible')) hideBox();
        else showBox();
    }

    btn.addEventListener('click', toggleBox);
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleBox(); }});
    closeBtn.addEventListener('click', hideBox);

    function showTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'chatbot-message bot typing';
        typing.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;
        return typing;
    }

    async function fetchBotReply(text) {
        try {
            const resp = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            if (!resp.ok) {
                const errText = await resp.text();
                console.error('Server error', resp.status, errText);
                return "Sorry, I couldn't reach the chat service.";
            }
            const data = await resp.json();
            return data.reply || "Sorry, no reply.";
        } catch (e) {
            console.error('Fetch error', e);
            return "Sorry, I couldn't reach the chat service.";
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const value = input.value.trim();
        if (!value) return;
        appendMessage(value, 'user');
        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;

        const typingEl = showTypingIndicator();
        const reply = await fetchBotReply(value);

        typingEl.remove();
        appendMessage(reply, 'bot');
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && box.classList.contains('visible')) hideBox();
    });

    box.setAttribute('role', 'dialog');
    input.placeholder = langData.placeholder;
    sendBtn.textContent = langData.send;
})();