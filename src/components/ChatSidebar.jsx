import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import CitationBadge from './CitationBadge';
import { useAuthStore } from '../store/useAuthStore';

const ChatSidebar = ({ courseId }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Xin chào! Tôi là trợ lý AI học tập. Bạn có câu hỏi nào về bài học này không?',
            citations: [],
        },
    ]);
    
    const [inputQuery, setInputQuery] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống đáy khi có token mới
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!inputQuery.trim() || isStreaming) return;

        const query = inputQuery.trim();
        setInputQuery('');

        // 1. Thêm tin nhắn của User và placeholder rỗng của Assistant
        setMessages((prev) => [
            ...prev,
            { role: 'user', content: query },
            { role: 'assistant', content: '', citations: [] },
        ]);
        setIsStreaming(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${useAuthStore.getState().access_token}`,
                },
                body: JSON.stringify({
                    course_id: courseId,
                    query: query
                }),
            });

            if (!response.ok || !response.body) {
                throw new Error('Kết nối stream thất bại');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';
            let number = 0;

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                console.groupCollapsed(`Debug SSE Data Chunk: ${++number}`);

                buffer += decoder.decode(value, { stream: true });
                console.log('Nội dung chunk:', buffer);
                
                // Chuẩn hóa ngắt dòng cho SSE (\r\n -> \n)
                const parts = buffer.split('\n\n');
                // Giữ lại phần chưa kết thúc dòng vào buffer để đợi chunk tiếp theo
                buffer = parts.pop() || '';

                console.log('Mảng các SSE:', parts);
                console.log('Phần chưa kết thúc:', buffer);
                console.groupEnd();

                for (const part of parts) {
                    const lines = part.split('\n');
                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith('data:')) continue;

                        // Bỏ tiền tố "data:" và khoảng trắng thừa
                        const jsonStr = trimmed.replace(/^data:\s*/, '').trim();
                        if (!jsonStr) continue;

                        try {
                            const packet = JSON.parse(jsonStr);

                            if (packet.type === 'citations') {
                                // Cập nhật citations không làm mutate object cũ
                                setMessages((prev) => {
                                    if (prev.length === 0) return prev;
                                    const lastIdx = prev.length - 1;
                                    const lastMsg = prev[lastIdx];

                                    return [
                                        ...prev.slice(0, lastIdx),
                                        {
                                            ...lastMsg,
                                            citations: packet.data,
                                        },
                                    ];
                                });
                            } else if (packet.type === 'token') {
                                // Cập nhật content: clone object mới để tránh double-invoke của React 18 Strict Mode
                                setMessages((prev) => {
                                    if (prev.length === 0) return prev;
                                    const lastIdx = prev.length - 1;
                                    const lastMsg = prev[lastIdx];

                                    return [
                                        ...prev.slice(0, lastIdx),
                                        {
                                            ...lastMsg,
                                            content: (lastMsg.content || '') + packet.data,
                                        },
                                    ];
                                });
                            } else if (packet.type === 'done') {
                                setIsStreaming(false);
                                return;
                            } else if (packet.type === 'error') {
                                console.error('Lỗi từ AI server:', packet.message);
                                setIsStreaming(false);
                                return;
                            }
                        } catch {
                            // Bỏ qua nếu dữ liệu dòng không phải JSON hợp lệ
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err);
            setMessages((prev) => {
                const lastIdx = prev.length - 1;
                const lastMsg = prev[lastIdx];
                return [
                    ...prev.slice(0, lastIdx),
                    {
                        ...lastMsg,
                        content: (lastMsg?.content || '') + '\n\n*(Đã xảy ra lỗi kết nối khi tải câu trả lời)*',
                    },
                ];
            });
        } finally {
            setIsStreaming(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/60">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-slate-200">Hỏi đáp cùng AI</h2>
                </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                    const isUser = msg.role === 'user';
                    return (
                        <div
                            key={index}
                            className={`flex gap-3 text-sm leading-relaxed ${
                                isUser ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            {!isUser && (
                                <div className="w-7 h-7 rounded-full bg-indigo-900/70 border border-indigo-700/50 flex items-center justify-center shrink-0 mt-0.5">
                                    <Bot className="w-4 h-4 text-indigo-300" />
                                </div>
                            )}

                            <div
                                className={`rounded-xl p-3.5 max-w-[85%] ${
                                isUser
                                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                                    : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-bl-none shadow'
                                }`}
                            >
                                {isUser ? (
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                ) : (
                                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-normal prose-pre:bg-slate-900">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        {isStreaming && index === messages.length - 1 && !msg.content && (
                                            <div className="flex items-center gap-2 text-slate-400 italic text-xs py-1">
                                                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                                                Đang truy vấn bài giảng và suy nghĩ...
                                            </div>
                                        )}
                                        {/* Render nút trích dẫn video */}
                                        <CitationBadge citations={msg.citations} />
                                    </div>
                                )}
                            </div>

                            {isUser && (
                                <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <User className="w-4 h-4 text-slate-300" />
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-slate-800 bg-slate-900/90 flex gap-2 items-center"
            >
                <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Hỏi về nội dung bài học..."
                    disabled={isStreaming}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isStreaming || !inputQuery.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white p-2.5 rounded-lg transition shrink-0"
                >
                {isStreaming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Send className="w-4 h-4" />
                )}
                </button>
            </form>
        </div>
    );
};

export default ChatSidebar;