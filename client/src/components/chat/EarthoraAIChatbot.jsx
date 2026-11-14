import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bot,
  Send,
  X,
  Sparkles,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Copy,
  Check,
  Leaf,
  Layers,
  Sprout,
  ShieldCheck,
  ShoppingCart,
  CloudSun,
  FlaskConical,
  GraduationCap,
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const DEFAULT_WELCOME_MESSAGE = {
  id: 'welcome-msg',
  sender: 'ai',
  text: `### 🌱 Welcome to EARTHORA AI Assistant!

I am your 24/7 intelligent copilot designed to clarify and rectify any doubts about navigating and using the **EARTHORA Smart Agriculture Ecosystem**:

- 🔐 **Authentication & Roles:** Admin credentials, farmer onboarding, and the expert accreditation approval process.
- 🌱 **Crop Management:** Tracking biological phenological stages, logging root-zone irrigation, and soil vigor scoring.
- 🛒 **Marketplace & Orders:** Purchasing organic inputs, discounts (\`ORGANIC10\`), and live order tracking.
- 🧪 **Soil & Weather Telemetry:** Optimal pH, NPK macronutrients, and microclimate radar advisories.
- 👨‍🌾 **Expert Consultations:** Booking accredited agronomists and soil microbiologists.

Ask me any question below, or select one of the suggested topics!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  relatedLinks: [
    { label: 'Crop Management', url: '/crop-management' },
    { label: 'Marketplace', url: '/marketplace' },
    { label: 'Soil Insights', url: '/soil-insights' },
    { label: 'Expert Connect', url: '/expert-connect' },
  ],
  suggestedQuestions: [
    'How do user roles and access permissions work in EARTHORA?',
    'Why is my expert registration pending admin approval?',
    'How do I add a new crop and log drip irrigation?',
    'How does marketplace shopping and order tracking work?',
  ],
};

const TOPIC_PRESETS = [
  { label: '🔐 User Roles & Access', prompt: 'How do user roles and account permissions work in EARTHORA?' },
  { label: '👨‍🌾 Expert Approval', prompt: 'How does the agriculture expert registration and approval process work?' },
  { label: '🌱 Crop Management', prompt: 'How do I add crops and log precision drip irrigation in Crop Management?' },
  { label: '🛒 Marketplace & Cart', prompt: 'How does marketplace checkout, discounts, and order tracking work?' },
  { label: '🧪 Soil Health', prompt: 'Explain optimal soil pH and NPK macronutrient levels for organic farming.' },
  { label: '🌦️ Weather Radar', prompt: 'How does the weather intelligence and agro-radar alert system work?' },
  { label: '🚜 Farmer Hub', prompt: 'How do farmers register land details and view active bio-intensive acreage?' },
];

export default function EarthoraAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([DEFAULT_WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: query,
        history: messages.slice(-6).map((m) => ({ role: m.sender, content: m.text })),
        context: {
          currentPath: location.pathname,
        },
      });

      const replyData = response.data?.data || {};

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyData.reply || 'I am here to help you navigate EARTHORA. Please ask your question!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: replyData.category,
        relatedLinks: replyData.relatedLinks || [],
        suggestedQuestions: replyData.suggestedQuestions || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const fallbackAI = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `### 🌱 EARTHORA Quick Help

Here is how you can resolve common platform questions:

- **Admin Login:** Dedicated administrative portal at \`/login\` for authorized system owners.
- **Expert Approval:** Expert registrations require admin verification in the Admin Dashboard.
- **Crop Management:** Visit \`/crop-management\` to register new crop plots and log irrigation inputs.
- **Marketplace:** Visit \`/marketplace\` to buy organic seeds, bio-fertilizers, and equipment. Use code \`ORGANIC10\` for 10% off.
- **Support:** Visit \`/contact\` or email \`support@earthora.io\`.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedLinks: [
          { label: 'Portal Login', url: '/login' },
          { label: 'Crop Management', url: '/crop-management' },
          { label: 'Marketplace', url: '/marketplace' },
        ],
        suggestedQuestions: [
          'How do user roles and permissions work?',
          'How does expert approval work?',
          'How do I track my order?',
        ],
      };
      setMessages((prev) => [...prev, fallbackAI]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([DEFAULT_WELCOME_MESSAGE]);
    showToast('Conversation reset.', 'info');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Answer copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLinkClick = (url) => {
    if (url.startsWith('/')) {
      navigate(url);
    } else {
      window.open(url, '_blank');
    }
  };

  // Simple Markdown text renderer (handles headers, bold, bullets, inline code, links)
  const renderFormattedText = (rawText) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-heading text-sm sm:text-base font-extrabold text-earthora-forest mt-2 mb-1.5 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Header 2
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-heading text-base font-extrabold text-earthora-forest mt-2 mb-1.5">
            {line.replace('## ', '')}
          </h3>
        );
      }
      // Numbered or bullet list
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      const isNumbered = /^\d+\.\s/.test(line.trim());

      let content = line;
      if (isBullet) content = line.trim().substring(2);
      if (isNumbered) content = line.trim().replace(/^\d+\.\s/, '');

      // Parse bold **text** and code `code`
      const parts = content.split(/(\*\*.*?\*\*|`.*?`)/g);

      const parsedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-earthora-forest">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={pIdx} className="rounded bg-earthora-forest/10 px-1 py-0.5 font-mono text-[11px] font-semibold text-emerald-800">
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-[13px] leading-relaxed text-earthora-charcoal/90 my-1">
            {parsedLine}
          </li>
        );
      }

      if (isNumbered) {
        return (
          <div key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] leading-relaxed text-earthora-charcoal/90 my-1">
            <span className="font-bold text-earthora-olive shrink-0">•</span>
            <div>{parsedLine}</div>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="text-xs sm:text-[13px] leading-relaxed text-earthora-charcoal/90 my-1">
          {parsedLine}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Chatbot Trigger Button (Bottom Right) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-earthora-mint/40 bg-earthora-forest px-3.5 py-1.5 text-xs font-bold text-white shadow-xl animate-bounce">
            <Sparkles className="h-3.5 w-3.5 text-earthora-mint animate-pulse" />
            <span>Have doubts? Ask Earthora AI</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Earthora AI Chatbot"
          className={`group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl shadow-2xl transition-all duration-300 ${
            isOpen
              ? 'bg-earthora-forest text-white rotate-90 scale-95'
              : 'bg-gradient-to-tr from-earthora-forest via-emerald-800 to-earthora-olive text-white hover:scale-105 hover:shadow-earthora-mint/30'
          }`}
        >
          {isOpen ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6 transition-transform" />
          ) : (
            <>
              <div className="relative">
                <Bot className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-earthora-mint opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400" />
                </span>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Floating AI Chat Window Drawer */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-16 sm:inset-x-auto sm:bottom-24 sm:right-6 z-50 w-auto sm:w-[440px] max-w-[440px] h-[calc(100dvh-75px)] sm:h-[78vh] max-h-[640px] flex flex-col overflow-hidden rounded-3xl border border-emerald-800/20 bg-white shadow-2xl shadow-earthora-forest/25 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="relative overflow-hidden bg-earthora-forest px-5 py-4 text-white shrink-0">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 h-28 w-28 rounded-full bg-earthora-mint/10 blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-earthora-mint/20 border border-earthora-mint/40 text-earthora-mint shadow-inner">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-extrabold tracking-tight text-white">
                      EARTHORA AI
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-earthora-sand/80">
                    Smart Farming & Platform Doubt Clearing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Reset Conversation"
                  className="rounded-lg p-1.5 text-earthora-sand/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close AI Assistant"
                  className="rounded-lg p-1.5 text-earthora-sand/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Topic Chips Slider */}
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              {TOPIC_PRESETS.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(t.prompt)}
                  disabled={isLoading}
                  className="shrink-0 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-earthora-sand hover:bg-white/20 hover:text-white transition-colors disabled:opacity-50"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-earthora-ivory/40">
            {messages.map((msg) => {
              const isAI = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-semibold text-earthora-muted">
                      {isAI ? 'Earthora AI Copilot' : 'You'}
                    </span>
                    <span className="text-[9px] text-earthora-muted/60">· {msg.timestamp}</span>
                  </div>

                  <div
                    className={`relative max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs sm:text-[13px] ${
                      isAI
                        ? 'bg-white border border-earthora-sand/70 text-earthora-charcoal rounded-tl-xs'
                        : 'bg-earthora-forest text-white rounded-tr-xs'
                    }`}
                  >
                    {isAI ? (
                      <div className="space-y-1">
                        {renderFormattedText(msg.text)}

                        {/* Interactive Navigation Pills */}
                        {msg.relatedLinks && msg.relatedLinks.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-earthora-sand/50">
                            <span className="text-[10px] font-bold text-earthora-olive uppercase tracking-wider block mb-1.5">
                              Quick Platform Actions:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.relatedLinks.map((link, lIdx) => (
                                <button
                                  key={lIdx}
                                  onClick={() => handleLinkClick(link.url)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-earthora-olive/30 bg-earthora-ivory px-2.5 py-1 text-[11px] font-bold text-earthora-forest hover:bg-earthora-olive hover:text-white transition-all shadow-xs"
                                >
                                  <span>{link.label}</span>
                                  <ChevronRight className="h-3 w-3 text-earthora-mint" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suggested Follow-ups */}
                        {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-earthora-sand/50">
                            <span className="text-[10px] font-bold text-earthora-muted uppercase tracking-wider block mb-1">
                              Related Doubts:
                            </span>
                            <div className="space-y-1">
                              {msg.suggestedQuestions.map((q, qIdx) => (
                                <button
                                  key={qIdx}
                                  onClick={() => handleSendMessage(q)}
                                  disabled={isLoading}
                                  className="w-full text-left rounded-lg bg-earthora-ivory/70 hover:bg-earthora-mint/15 px-2.5 py-1.5 text-[11px] font-medium text-earthora-forest transition-colors flex items-center justify-between group"
                                >
                                  <span className="line-clamp-1">{q}</span>
                                  <Sparkles className="h-3 w-3 text-earthora-mint opacity-0 group-hover:opacity-100 shrink-0 ml-1" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Copy button */}
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-earthora-muted hover:text-earthora-forest transition-colors"
                            title="Copy answer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed text-white">
                        {msg.text}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-semibold text-earthora-muted">Earthora AI</span>
                  <span className="text-[9px] text-earthora-muted/60">thinking...</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs border border-earthora-sand/70 bg-white px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-earthora-mint animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 rounded-full bg-earthora-olive animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 rounded-full bg-earthora-forest animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="border-t border-earthora-sand/70 bg-white p-3 shrink-0">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask any doubt about EARTHORA or farming..."
                disabled={isLoading}
                className="w-full rounded-2xl border border-earthora-sand/90 bg-earthora-ivory/50 py-3 pl-4 pr-12 text-base sm:text-sm text-earthora-charcoal placeholder-earthora-muted/60 focus:border-earthora-forest focus:bg-white focus:outline-none focus:ring-2 focus:ring-earthora-forest/20 disabled:opacity-60 transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-earthora-forest text-white transition-all hover:bg-earthora-olive active:scale-95 disabled:bg-earthora-sand/60 disabled:text-earthora-muted/40 disabled:cursor-not-allowed shadow-sm"
                title="Send Question"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-earthora-muted/80 px-1">
              <span>Press <strong>Enter</strong> to ask</span>
              <span className="flex items-center gap-1">
                <Leaf className="h-3 w-3 text-earthora-mint inline" />
                Rooted in Nature. Driven by Innovation.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

