import { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

function isAllowedChatLink(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return false;
    return (
      (url.hostname === 'github.com' && url.pathname.startsWith('/CS-Fasih/'))
      || (url.hostname === 'linkedin.com' || url.hostname === 'www.linkedin.com')
      || url.hostname === 'muhammadfasih.vercel.app'
      || (url.hostname === 'fiverr.com' && url.pathname.startsWith('/cs_fasih'))
    );
  } catch {
    return false;
  }
}

// Simple markdown-to-HTML renderer for bot responses
function renderMarkdown(text) {
  let html = text
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="chatbot-inline-code">$1</code>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => (
      isAllowedChatLink(href)
        ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`
        : label
    ))
    // Line breaks
    .replace(/\n/g, '<br />');
    
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['a', 'br', 'code', 'em', 'pre', 'strong'],
    ALLOWED_ATTR: ['class', 'href', 'rel', 'target'],
    ALLOW_DATA_ATTR: false,
  });
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm Fasih's AI assistant. Ask me anything about his projects, skills, experience, or availability.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Focus input when chat opens and manage body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('chatbot-open');
      if (inputRef.current && window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 300);
      }
    } else {
      document.body.classList.remove('chatbot-open');
    }
    
    return () => document.body.classList.remove('chatbot-open');
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: 'user', text: trimmed };
    setMessages((prev) => [
      prev[0],
      ...prev.slice(1).concat(userMessage).slice(-40),
    ]);
    setInput('');
    setIsLoading(true);

    // Build history for multi-turn context (exclude welcome message)
    const history = messages
      .slice(1)
      .slice(-20)
      .map((m) => ({
        role: m.role === 'bot' ? 'model' : 'user',
        text: m.text,
      }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          prev[0],
          ...prev.slice(1).concat({ role: 'bot', text: data.reply }).slice(-40),
        ]);
      } else {
        setMessages((prev) => [
          prev[0],
          ...prev.slice(1).concat({
            role: 'bot',
            text: data.error || "Sorry, I couldn't process that. Please try again.",
          }).slice(-40),
        ]);
      }
    } catch {
      setMessages((prev) => [
        prev[0],
        ...prev.slice(1).concat({
          role: 'bot',
          text: "Connection error. Please check your internet and try again.",
        }).slice(-40),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Floating Chat Bubble ── */}
      <button
        className={`chatbot-bubble ${isOpen ? 'chatbot-bubble--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open AI chat assistant'}
        id="chatbot-toggle"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
            <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
          </svg>
        )}
      </button>

      {/* ── Chat Panel ── */}
      <div className={`chatbot-panel ${isOpen ? 'chatbot-panel--open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header__info">
            <span className="chatbot-header__title" style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.5px' }}>
              Ask my Assistant
            </span>
          </div>
          <button
            className="chatbot-header__close"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-msg chatbot-msg--${msg.role}`}>
              {msg.role === 'bot' && (
                <div className="chatbot-msg__avatar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              )}
              {msg.role === 'bot' ? (
                <div
                  className="chatbot-msg__bubble"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                />
              ) : (
                <div className="chatbot-msg__bubble">{msg.text}</div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="chatbot-msg chatbot-msg--bot">
              <div className="chatbot-msg__avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="chatbot-msg__bubble chatbot-typing">
                <span className="chatbot-typing__dot" />
                <span className="chatbot-typing__dot" />
                <span className="chatbot-typing__dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbot-input">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about projects, skills..."
            aria-label="Ask about projects, skills..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            maxLength={2000}
            id="chatbot-input-field"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="chatbot-input__send"
            aria-label="Send message"
            title={isLoading || !input.trim() ? "Type a message to send" : "Send message"}
            id="chatbot-send-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
