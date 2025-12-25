import { useState, useEffect, useRef } from 'react'
import { Search, Send, MessageSquare, User, Package, ChevronRight } from 'lucide-react'
import { messageApi } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import SellerLayout from './SellerLayout'
import { useToast } from '@/hooks/use-toast'

interface Message {
    id: string
    senderId: string
    senderName: string
    receiverId: string
    receiverName: string
    productId?: string
    productName?: string
    content: string
    createdAt: string
    read: boolean
}

interface Conversation {
    userId: string
    userName: string
    lastMessage: string
    timestamp: string
    unreadCount: number
    productId?: string
    productName?: string
}

export default function SellerMessages() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [activeMenu, setActiveMenu] = useState("messages")
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [messagesLoading, setMessagesLoading] = useState(false)
    const [sending, setSending] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (user?.id) {
            loadConversations()
        }
    }, [user?.id])

    useEffect(() => {
        if (selectedUserId && user?.id) {
            loadConversation(selectedUserId)
        }
    }, [selectedUserId, user?.id])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const loadConversations = async () => {
        if (!user?.id) return
        try {
            setLoading(true)
            const allMessages = await messageApi.getUserMessages(user.id)

            // Group messages by the other user to form conversations
            const conversationMap = new Map<string, Conversation>()

            allMessages.forEach((msg: Message) => {
                const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId
                const otherUserName = msg.senderId === user.id ? msg.receiverName : msg.senderName

                if (!conversationMap.has(otherUserId)) {
                    conversationMap.set(otherUserId, {
                        userId: otherUserId,
                        userName: otherUserName,
                        lastMessage: msg.content,
                        timestamp: msg.createdAt,
                        unreadCount: (!msg.read && msg.receiverId === user.id) ? 1 : 0,
                        productId: msg.productId,
                        productName: msg.productName
                    })
                } else {
                    const conv = conversationMap.get(otherUserId)!
                    if (new Date(msg.createdAt) > new Date(conv.timestamp)) {
                        conv.lastMessage = msg.content
                        conv.timestamp = msg.createdAt
                    }
                    if (!msg.read && msg.receiverId === user.id) {
                        conv.unreadCount += 1
                    }
                }
            })

            const sortedConversations = Array.from(conversationMap.values())
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

            setConversations(sortedConversations)

            // Auto-select first conversation if none selected
            if (sortedConversations.length > 0 && !selectedUserId) {
                setSelectedUserId(sortedConversations[0].userId)
            }
        } catch (error) {
            console.error('Failed to load conversations:', error)
            toast({
                title: "Error",
                description: "Could not load conversations",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const loadConversation = async (otherId: string) => {
        if (!user?.id) return
        try {
            setMessagesLoading(true)
            const conversation = await messageApi.getConversation(user.id, otherId)
            setMessages(conversation)

            // Mark all received messages in this conversation as read
            const unreadMessages = conversation.filter(m => !m.read && m.receiverId === user.id)
            for (const m of unreadMessages) {
                await messageApi.markAsRead(m.id)
            }

            // Update unread count local state
            setConversations(prev => prev.map(c =>
                c.userId === otherId ? { ...c, unreadCount: 0 } : c
            ))
        } catch (error) {
            console.error('Failed to load conversation:', error)
        } finally {
            setMessagesLoading(false)
        }
    }

    const handleSend = async () => {
        if (!newMessage.trim() || !user?.id || !selectedUserId) return

        try {
            setSending(true)
            const currentConv = conversations.find(c => c.userId === selectedUserId)

            const sent = await messageApi.send({
                senderId: user.id,
                receiverId: selectedUserId,
                productId: currentConv?.productId,
                content: newMessage.trim(),
            })

            setMessages(prev => [...prev, sent])
            setNewMessage('')

            // Update conversation list item
            setConversations(prev => {
                const updated = prev.filter(c => c.userId !== selectedUserId)
                const target = prev.find(c => c.userId === selectedUserId)
                if (target) {
                    return [{
                        ...target,
                        lastMessage: sent.content,
                        timestamp: sent.createdAt
                    }, ...updated]
                }
                return prev
            })
        } catch (error) {
            console.error('Failed to send message:', error)
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive"
            })
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

    const filteredConversations = conversations.filter(c =>
        c.userName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedConversation = conversations.find(c => c.userId === selectedUserId)

    return (
        <SellerLayout activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
            <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-white">
                {/* Conversations Sidebar */}
                <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50/50">
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <h2 className="text-xl font-bold mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading && conversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">Loading...</div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                <p>No conversations found</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <button
                                    key={conv.userId}
                                    onClick={() => setSelectedUserId(conv.userId)}
                                    className={`w-full p-4 flex gap-3 border-b border-gray-100 transition text-left group
                                        ${selectedUserId === conv.userId ? 'bg-cyan-50' : 'hover:bg-white'}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-bold text-lg group-hover:scale-105 transition">
                                            {conv.userName.charAt(0).toUpperCase()}
                                        </div>
                                        {conv.unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-900 truncate">{conv.userName}</h3>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                {new Date(conv.timestamp).toLocaleDateString() === new Date().toLocaleDateString()
                                                    ? new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    : new Date(conv.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                                            {conv.lastMessage}
                                        </p>
                                        {conv.productName && (
                                            <div className="mt-1 flex items-center gap-1 text-[10px] text-cyan-600 font-medium bg-cyan-50 rounded px-1.5 py-0.5 w-fit">
                                                <Package className="w-2.5 h-2.5" />
                                                <span className="truncate max-w-[120px]">{conv.productName}</span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedUserId && selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-bold">
                                        {selectedConversation.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight">{selectedConversation.userName}</h3>
                                        <p className="text-xs text-green-500 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                            Active Now
                                        </p>
                                    </div>
                                </div>
                                {selectedConversation.productName && (
                                    <div className="hidden sm:flex items-center gap-2 border border-blue-100 bg-blue-50/50 rounded-lg px-3 py-1.5">
                                        <Package className="w-4 h-4 text-blue-500" />
                                        <div className="text-left">
                                            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Regarding Product</p>
                                            <p className="text-xs text-blue-800 font-semibold truncate max-w-[200px]">
                                                {selectedConversation.productName}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-3 h-3 text-blue-300" />
                                    </div>
                                )}
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                                {messagesLoading ? (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                                        <User className="w-12 h-12 opacity-10" />
                                        <p>Start a conversation with {selectedConversation.userName}</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isOwn = msg.senderId === user?.id
                                        const showDate = index === 0 ||
                                            new Date(msg.createdAt).toDateString() !== new Date(messages[index - 1].createdAt).toDateString()

                                        return (
                                            <div key={msg.id} className="space-y-4">
                                                {showDate && (
                                                    <div className="flex justify-center my-6">
                                                        <span className="text-[10px] font-bold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm uppercase tracking-widest">
                                                            {new Date(msg.createdAt).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                                    <div className={`max-w-[75%] space-y-1`}>
                                                        <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm
                                                            ${isOwn
                                                                ? 'bg-cyan-500 text-white rounded-br-none'
                                                                : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none'}`}
                                                        >
                                                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                                        </div>
                                                        <p className={`text-[10px] font-medium ${isOwn ? 'text-right text-gray-400' : 'text-left text-gray-400'}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            {isOwn && msg.read && <span className="ml-2 text-cyan-500 font-bold">Read</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t border-gray-200 bg-white">
                                <div className="flex gap-2 items-end max-w-4xl mx-auto">
                                    <div className="flex-1 relative">
                                        <textarea
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder={`Message ${selectedConversation.userName}...`}
                                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none bg-gray-50 min-h-[46px] max-h-32 transition"
                                            rows={newMessage.split('\n').length}
                                            disabled={sending}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSend}
                                        disabled={!newMessage.trim() || sending}
                                        className="bg-cyan-600 hover:bg-cyan-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-lg shadow-cyan-200 disabled:opacity-50 disabled:shadow-none shrink-0"
                                    >
                                        <Send className={`w-5 h-5 ${sending ? 'animate-pulse' : ''}`} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 text-center">
                                    Press <b>Enter</b> to send, <b>Shift + Enter</b> for a new line
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30">
                            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-100 flex flex-col items-center text-center max-w-sm">
                                <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mb-6">
                                    <MessageSquare className="w-10 h-10 text-cyan-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Your Message Center</h3>
                                <p className="text-sm text-gray-500 mb-8">
                                    Select a customer from the left to start chatting and answering their product questions.
                                </p>
                                <div className="flex flex-col gap-3 w-full">
                                    <div className="flex items-center gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100 text-left">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Real-time notifications for new inquiries</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100 text-left">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>Direct link to products they're asking about</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SellerLayout>
    )
}
