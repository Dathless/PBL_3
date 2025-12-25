import { useState, useEffect, useRef } from 'react'
import { X, Send } from 'lucide-react'
import { messageApi } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'

interface Message {
    id: string
    senderId: string
    senderName: string
    receiverId: string
    receiverName: string
    content: string
    createdAt: string
    read: boolean
}

interface MessageModalProps {
    isOpen: boolean
    onClose: () => void
    sellerId: string
    sellerName: string
    productId?: string
    productName?: string
}

export function MessageModal({ isOpen, onClose, sellerId, sellerName, productId, productName }: MessageModalProps) {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Load conversation
    useEffect(() => {
        if (isOpen && user?.id && sellerId) {
            loadConversation()
        }
    }, [isOpen, user?.id, sellerId])

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const loadConversation = async () => {
        if (!user?.id) return
        try {
            setLoading(true)
            const conversation = await messageApi.getConversation(user.id, sellerId)
            setMessages(conversation)
        } catch (error) {
            console.error('Failed to load conversation:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSend = async () => {
        if (!newMessage.trim() || !user?.id) return

        try {
            setSending(true)
            const sent = await messageApi.send({
                senderId: user.id,
                receiverId: sellerId,
                productId: productId,
                content: newMessage.trim(),
            })
            setMessages([...messages, sent])
            setNewMessage('')
        } catch (error) {
            console.error('Failed to send message:', error)
            alert('Failed to send message. Please try again.')
        } finally {
            setSending(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[600px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Message Seller</h3>
                        <p className="text-sm text-gray-600">{sellerName}</p>
                        {productName && (
                            <p className="text-xs text-gray-500 mt-1">About: {productName}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {loading ? (
                        <div className="text-center text-gray-500 py-8">Loading messages...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <p>No messages yet.</p>
                            <p className="text-sm mt-2">Start a conversation with the seller!</p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isOwnMessage = message.senderId === user?.id
                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg px-4 py-2 ${isOwnMessage
                                                ? 'bg-cyan-500 text-white'
                                                : 'bg-white text-gray-900 border border-gray-200'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                        <p
                                            className={`text-xs mt-1 ${isOwnMessage ? 'text-cyan-100' : 'text-gray-500'
                                                }`}
                                        >
                                            {new Date(message.createdAt).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 resize-none"
                            rows={2}
                            disabled={sending}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!newMessage.trim() || sending}
                            className="bg-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            {sending ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
                </div>
            </div>
        </div>
    )
}
