import { useState, useRef, useEffect } from 'react';

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
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n/g, '<br />');
  return html;
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
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Build history for multi-turn context (exclude welcome message)
    const history = messages
      .filter((_, i) => i > 0) // skip the welcome message
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
        setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: data.error || "Sorry, I couldn't process that. Please try again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: "Connection error. Please check your internet and try again.",
        },
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
            <div className="chatbot-header__avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10H5a2 2 0 0 0-2 2v1a7 7 0 0 0 14 0v-1a2 2 0 0 0-2-2z" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <line x1="8" y1="21" x2="16" y2="21" />
              </svg>
            </div>
            <div>
              <span className="chatbot-header__title">Ask Fasih's AI</span>
              <span className="chatbot-header__status">
                <span className="chatbot-header__dot" />
                Online
              </span>
            </div>
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
              <div
                className="chatbot-msg__bubble"
                dangerouslySetInnerHTML={{
                  __html: msg.role === 'bot' ? renderMarkdown(msg.text) : msg.text,
                }}
              />
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
