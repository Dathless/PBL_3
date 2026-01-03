import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'

interface ChatMessage {
    id: string
    text: string
    isBot: boolean
    timestamp: Date
}

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            text: 'Hello! 👋 I\'m your LITE shopping assistant. I can help you with products, orders, payments, technical issues, and more. What can I help you with today?',
            isBot: true,
            timestamp: new Date(),
        },
    ])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Comprehensive FAQ knowledge base
    const getResponse = (userMessage: string): string => {
        const msg = userMessage.toLowerCase()

        // Greetings
        if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') || msg.includes('chào')) {
            return 'Hello! 👋 Welcome to LITE Shopping. I\'m here to help you with:\n• Finding products\n• Placing orders\n• Account issues\n• Payment & shipping\n• Technical problems\n\nWhat can I help you with today?'
        }

        // Product browsing and search
        if (msg.includes('find') || msg.includes('search') || msg.includes('browse') || msg.includes('look for')) {
            return '🔍 To find products:\n1. Use the search bar at the top\n2. Click CATEGORIES to browse by type (T-Shirt, Jacket, Shoes, etc.)\n3. Click BRANDS to shop by brand (Nike, Adidas, Zara, etc.)\n4. Check "Today\'s Deals" for special offers\n\nNeed help finding something specific?'
        }

        // Product details and stock
        if (msg.includes('stock') || msg.includes('available')) {
            return '📦 Stock Information:\n• Stock availability is shown on each product page\n• Select color and size to see accurate details\n\nYou can message the seller directly for more information!'
        }

        // Adding to cart
        if (msg.includes('add to cart') || msg.includes('cart') || msg.includes('shopping cart')) {
            return '🛒 Shopping Cart:\n1. Click "ADD TO CART" on any product\n2. Select color, size, and quantity\n3. View cart by clicking cart icon (top right)\n4. Update quantities or remove items as needed\n5. Click "Proceed to Checkout" when ready\n\nYour cart is saved even if you log out!'
        }

        // Placing orders
        if (msg.includes('order') || msg.includes('buy') || msg.includes('purchase') || msg.includes('checkout')) {
            return '✅ How to Place an Order:\n1. Add items to cart\n2. Go to checkout\n3. Enter/confirm shipping address\n4. Choose payment method (COD or E-Wallet)\n5. Review order details\n6. Click "Place Order"\n\nYou\'ll receive confirmation and can track in "My Orders"!'
        }

        // Payment methods
        if (msg.includes('payment') || msg.includes('pay') || msg.includes('cod') || msg.includes('wallet') || msg.includes('cash')) {
            return '💳 Payment Methods:\n\n1. **Cash on Delivery (COD)**\n   • Pay when you receive the product\n   • Available for all orders\n   • Safe and convenient\n\n2. **E-Wallet**\n   • Pay online instantly\n   • Secure payment gateway\n   • Faster processing\n\nBoth methods are 100% secure!'
        }

        // Shipping and delivery
        if (msg.includes('ship') || msg.includes('delivery') || msg.includes('deliver') || msg.includes('address')) {
            return '🚚 Shipping & Delivery:\n• Enter complete address at checkout\n• Delivery time: 2-5 business days\n• Track order in "My Orders" section\n• Free shipping on orders over $50\n• You can update address before seller ships\n\nMake sure your address is accurate!'
        }

        // Order tracking
        if (msg.includes('track') || msg.includes('where is my order') || msg.includes('order status')) {
            return '📍 Track Your Order:\n1. Go to "My Orders" (top menu)\n2. Find your order\n3. Check current status:\n   • Pending - Waiting for seller\n   • Processing - Being prepared\n   • Shipped - On the way\n   • Delivered - Completed\n\nClick order for detailed tracking info!'
        }

        // Cancel order
        if (msg.includes('cancel') || msg.includes('refund') || msg.includes('return')) {
            return '↩️ Cancel/Return Order:\n\n**Before Shipping:**\n• Go to "My Orders"\n• Click "Cancel Order"\n• Reason required\n• Instant cancellation\n\n**After Delivery:**\n• Contact seller within 7 days\n• Product must be unused\n• Original packaging required\n\nRefunds processed in 5-7 business days.'
        }

        // Account and login
        if (msg.includes('account') || msg.includes('login') || msg.includes('sign up') || msg.includes('register') || msg.includes('password')) {
            return '👤 Account Help:\n\n**Create Account:**\n• Click "Log in" → "Sign up"\n• Choose Customer or Seller\n• Fill in details\n• Verify email\n\n**Forgot Password:**\n• Click "Forgot Password" on login\n• Enter your email\n• Check email for reset link\n\n**Update Profile:**\n• Click your name (top right)\n• Go to "Profile"\n• Edit and save changes'
        }

        // Seller features
        if (msg.includes('sell') || msg.includes('seller') || msg.includes('become seller') || msg.includes('shop')) {
            return '🏪 Become a Seller:\n\n**Getting Started:**\n1. Register as Seller\n2. Complete profile\n3. Add products with photos\n4. Wait for admin approval\n5. Start selling!\n\n**Seller Dashboard:**\n• Manage products\n• View orders\n• Track sales\n• Message buyers\n• Analytics & reports\n\nCommission: 10% per sale'
        }

        // Reviews and ratings
        if (msg.includes('review') || msg.includes('rating') || msg.includes('feedback') || msg.includes('comment')) {
            return '⭐ Reviews & Ratings:\n\n**Write a Review:**\n1. Go to "My Orders"\n2. Find delivered order\n3. Click "Write Review"\n4. Rate 1-5 stars\n5. Add comments\n6. Submit\n\n**Read Reviews:**\n• Scroll down on product page\n• See customer ratings\n• Read detailed comments\n• Check seller shop name\n\nHelp others make informed decisions!'
        }

        // Message seller
        if (msg.includes('message') || msg.includes('contact seller') || msg.includes('ask seller') || msg.includes('chat')) {
            return '💬 Message Seller:\n\n**On Product Page:**\n1. Click "Message Seller" button\n2. Chat window opens\n3. Type your question\n4. Get direct response\n\n**Common Questions:**\n• Product availability\n• Customization options\n• Bulk orders\n• Shipping details\n\nSellers usually respond within 24 hours!'
        }

        // Technical issues - Page loading
        if (msg.includes('page') && (msg.includes('load') || msg.includes('not loading') || msg.includes('slow') || msg.includes('blank'))) {
            return '🔧 Page Loading Issues:\n\n**Quick Fixes:**\n1. Refresh page (F5 or Cmd+R)\n2. Clear browser cache:\n   • Chrome: Ctrl+Shift+Delete\n   • Safari: Cmd+Option+E\n3. Try incognito/private mode\n4. Check internet connection\n5. Try different browser\n\n**Still not working?**\nContact support with:\n• Browser name & version\n• Screenshot of error\n• Steps to reproduce'
        }

        // Technical issues - Images
        if (msg.includes('image') || msg.includes('photo') || msg.includes('picture')) {
            if (msg.includes('not') || msg.includes('load') || msg.includes('show') || msg.includes('broken')) {
                return '🖼️ Image Not Loading:\n\n**Solutions:**\n1. Wait a few seconds (slow connection)\n2. Refresh the page\n3. Clear browser cache\n4. Check internet speed\n5. Disable ad blockers\n6. Try different browser\n\n**Uploading Images:**\n• Max size: 5MB\n• Formats: JPG, PNG, WebP\n• Recommended: 1000x1000px\n• Multiple images supported'
            }
        }

        // Technical issues - Cart
        if ((msg.includes('cart') || msg.includes('checkout')) && (msg.includes('error') || msg.includes('not working') || msg.includes('problem'))) {
            return '🛒 Cart/Checkout Issues:\n\n**Common Problems:**\n\n1. **Items disappearing:**\n   • Login to save cart\n   • Check stock availability\n   • Refresh page\n\n2. **Can\'t checkout:**\n   • Verify shipping address\n   • Check payment method\n   • Ensure items in stock\n   • Try different browser\n\n3. **Price wrong:**\n   • Refresh page\n   • Check for promotions\n   • Verify quantity\n\nStill stuck? Clear cart and try again!'
        }

        // Technical issues - Login
        if ((msg.includes('login') || msg.includes('sign in')) && (msg.includes('can\'t') || msg.includes('cannot') || msg.includes('error') || msg.includes('problem'))) {
            return '🔐 Login Problems:\n\n**Can\'t Login:**\n1. Check email/password spelling\n2. Try "Forgot Password"\n3. Clear browser cookies\n4. Disable browser extensions\n5. Try incognito mode\n\n**Account Locked:**\n• Too many failed attempts\n• Wait 30 minutes\n• Or reset password\n\n**Email Not Verified:**\n• Check spam folder\n• Resend verification email\n• Contact support if needed'
        }

        // Technical issues - Payment
        if (msg.includes('payment') && (msg.includes('fail') || msg.includes('error') || msg.includes('declined') || msg.includes('not working'))) {
            return '💳 Payment Failed:\n\n**Why Payment Fails:**\n1. Insufficient funds\n2. Card expired\n3. Wrong CVV/PIN\n4. Bank security block\n5. Network timeout\n\n**Solutions:**\n• Try different payment method\n• Use COD instead\n• Contact your bank\n• Check card details\n• Retry after 5 minutes\n\n**Still failing?**\nTry COD or contact support!'
        }

        // Technical issues - General errors
        if (msg.includes('error') || msg.includes('bug') || msg.includes('not working') || msg.includes('broken') || msg.includes('issue') || msg.includes('problem')) {
            return '⚠️ Technical Issues:\n\n**First Steps:**\n1. Refresh page (F5)\n2. Clear cache & cookies\n3. Try incognito mode\n4. Check internet connection\n5. Update browser\n6. Disable extensions\n7. Try different browser\n\n**Report a Bug:**\n• Take screenshot\n• Note error message\n• Describe what happened\n• Email: support@lite.com\n\n**Common Issues:**\n• Page not loading → Refresh\n• Images missing → Clear cache\n• Cart issues → Re-login\n• Payment fails → Try COD'
        }

        // Promotions and deals
        if (msg.includes('promo') || msg.includes('discount') || msg.includes('coupon') || msg.includes('deal') || msg.includes('sale')) {
            return '🎁 Promotions & Deals:\n\n**Current Offers:**\n• Check "Today\'s Deals" section\n• Up to 80% off on selected items\n• Free shipping over $50\n• New user discount: 10% off\n\n**How to Use Coupons:**\n1. Add items to cart\n2. Go to checkout\n3. Enter coupon code\n4. Click "Apply"\n5. See discount applied\n\n**Where to Find:**\n• Home page banners\n• Email newsletters\n• Social media\n• Special events'
        }

        // Size and fit
        if (msg.includes('size') || msg.includes('fit') || msg.includes('measurement')) {
            return '📏 Size & Fit Guide:\n\n**Finding Your Size:**\n1. Check product size chart\n2. Measure yourself accurately\n3. Compare with chart\n4. Read customer reviews\n5. Message seller if unsure\n\n**Size Chart Location:**\n• Product page description\n• Below "Add to Cart"\n• In product details tab\n\n**Wrong Size Received:**\n• Contact seller immediately\n• Exchange within 7 days\n• Keep original packaging\n• Return shipping may apply'
        }

        // Colors and variants
        if (msg.includes('color') || msg.includes('variant') || msg.includes('option')) {
            return '🎨 Colors & Variants:\n\n**Selecting Options:**\n1. Choose color from swatches\n2. Select size from dropdown\n3. Details update automatically\n4. Price may vary by variant\n\n**Stock by Variant:**\n• Each color/size has its own availability\n• Message seller if you have questions\n\n**Color Accuracy:**\n• Colors may vary slightly\n• Check product photos\n• Read descriptions\n• Contact seller if unsure'
        }

        // Help and support
        if (msg.includes('help') || msg.includes('support') || msg.includes('contact') || msg.includes('customer service')) {
            return '🆘 Customer Support:\n\n**I can help with:**\n• Product search & browsing\n• Order placement & tracking\n• Account & login issues\n• Payment & shipping\n• Returns & refunds\n• Technical problems\n• Seller features\n\n**Contact Support:**\n📧 Email: support@lite.com\n📞 Phone: +1-800-123-4567\n⏰ Hours: 9 AM - 6 PM (Mon-Fri)\n\n**For Sellers:**\nUse "Message Seller" on product page\n\nWhat do you need help with?'
        }

        // Default response
        return '🤔 I\'m not sure about that specific question, but I can help you with:\n\n**Shopping:**\n• Finding products\n• Placing orders\n• Payment & shipping\n• Order tracking\n\n**Account:**\n• Login issues\n• Password reset\n• Profile updates\n\n**Technical:**\n• Page errors\n• Cart problems\n• Payment failures\n\n**Seller:**\n• Becoming a seller\n• Managing products\n• Order fulfillment\n\nWhat would you like to know more about?'
    }

    const handleSend = () => {
        if (!inputText.trim()) return

        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: inputText,
            isBot: false,
            timestamp: new Date(),
        }
        setMessages((prev) => [...prev, userMessage])
        const currentInput = inputText
        setInputText('')

        // Show typing indicator
        setIsTyping(true)

        // Simulate thinking time
        setTimeout(() => {
            const response = getResponse(currentInput)
            const botMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: response,
                isBot: true,
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, botMessage])
            setIsTyping(false)
        }, 800)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full shadow-2xl hover:shadow-cyan-500/50 hover:scale-110 transition-all duration-300 z-50 group"
                    aria-label="Open chatbot"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                        !
                    </span>
                    <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Need help? Chat with us!
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">Shopping Assistant</h3>
                                <p className="text-xs text-cyan-100">Online • Always here to help</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-2 rounded-full transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.isBot
                                        ? 'bg-white text-gray-800 border border-gray-200'
                                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                        }`}
                                >
                                    {message.isBot && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <Bot className="w-4 h-4 text-cyan-500" />
                                            <span className="text-xs font-semibold text-cyan-600">Assistant</span>
                                        </div>
                                    )}
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                    <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-400' : 'text-cyan-100'}`}>
                                        {message.timestamp.toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your question..."
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputText.trim() || isTyping}
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-full hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Press Enter to send • Shift+Enter for new line
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}
