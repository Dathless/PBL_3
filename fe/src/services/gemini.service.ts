import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI((import.meta as any).env.VITE_GEMINI_API_KEY || '')

// System prompt to give context to the AI
const SYSTEM_PROMPT = `You are a helpful shopping assistant for an e-commerce website. Your role is to help customers with:

1. **Products**: Help users find products, understand product details, check stock availability, and read reviews.

2. **Orders**: Guide users through placing orders, tracking shipments, canceling orders, and understanding order status.

3. **Shopping Cart**: Assist with adding items to cart, updating quantities, removing items, and proceeding to checkout.

4. **Account**: Help with login, registration, profile updates, password recovery, and becoming a seller.

5. **Seller Features**: Guide sellers on adding products, managing inventory, viewing orders, and messaging buyers.

6. **Payments**: Explain payment methods (COD and E-Wallet), payment security, and payment processing.

7. **Shipping**: Provide information about shipping addresses, delivery times, shipment tracking, and address changes.

8. **Stock & Availability**: Help check stock levels, explain variant availability, and guide on messaging sellers about restocks.

9. **Reviews**: Explain how to read and write reviews, rate products, and review guidelines.

10. **Technical Support**: Help troubleshoot issues, provide browser compatibility info, and guide on reporting bugs.

**Important Guidelines:**
- Be friendly, concise, and helpful
- Use simple language that's easy to understand
- Provide step-by-step instructions when needed
- If you don't know something, be honest and suggest contacting support
- Keep responses under 150 words for better readability
- Use bullet points or numbered lists for clarity
- Always maintain a positive, supportive tone

**Website Features:**
- Navigation menu for browsing categories
- Search bar for finding specific items
- Product pages with details, reviews, and stock info
- Shopping cart and checkout process
- User accounts (Customer and Seller roles)
- Seller dashboard for managing products and orders
- "Message Seller" feature for buyer-seller communication
- Order tracking in "My Orders" section
- Payment methods: COD (Cash on Delivery) and E-Wallet

Answer the user's question based on this context.`

export interface GeminiChatMessage {
    role: 'user' | 'model'
    parts: string
}

export class GeminiService {
    private model: any
    private chat: any
    private conversationHistory: GeminiChatMessage[] = []

    constructor() {
        this.model = genAI.getGenerativeModel({ model: 'gemini-pro' })
        this.initializeChat()
    }

    private initializeChat() {
        this.chat = this.model.startChat({
            history: [
                {
                    role: 'user',
                    parts: SYSTEM_PROMPT,
                },
                {
                    role: 'model',
                    parts: 'I understand. I\'m ready to help customers with their shopping needs. I\'ll provide clear, concise, and helpful responses about products, orders, accounts, payments, shipping, and any technical issues they may encounter.',
                },
            ],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
                topP: 0.8,
                topK: 40,
            },
        })
    }

    async sendMessage(userMessage: string): Promise<string> {
        try {
            // Check if API key is configured
            const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY
            if (!apiKey || apiKey === 'your_gemini_api_key_here') {
                console.error('Gemini API key is not configured properly')
                return 'Please configure your Gemini API key in the .env file. Get your key from https://makersuite.google.com/app/apikey'
            }

            const result = await this.chat.sendMessage(userMessage)
            const response = await result.response
            const text = response.text()

            // Store in conversation history
            this.conversationHistory.push(
                { role: 'user', parts: userMessage },
                { role: 'model', parts: text }
            )

            return text
        } catch (error: any) {
            console.error('Gemini API Error:', error)
            console.error('Error details:', {
                message: error?.message,
                status: error?.status,
                statusText: error?.statusText,
            })

            // More specific error messages
            if (error?.message?.includes('API_KEY_INVALID')) {
                return 'Your Gemini API key appears to be invalid. Please check your API key at https://makersuite.google.com/app/apikey'
            }

            if (error?.message?.includes('quota')) {
                return 'API quota exceeded. Please check your Gemini API usage limits.'
            }

            // Fallback to basic response if API fails
            return this.getFallbackResponse(userMessage)
        }
    }

    private getFallbackResponse(message: string): string {
        const msg = message.toLowerCase()

        if (msg.includes('product') || msg.includes('item')) {
            return 'You can browse products using the navigation menu or search bar. Each product page shows details, reviews, and stock availability. Is there a specific product you\'re looking for?'
        }

        if (msg.includes('order')) {
            return 'To place an order: Add items to cart → Go to checkout → Enter shipping address → Choose payment method → Confirm. You can track orders in "My Orders". Need help with a specific order?'
        }

        if (msg.includes('help') || msg.includes('support')) {
            return 'I\'m here to help! I can assist with products, orders, cart, account, payments, shipping, and technical issues. What would you like to know?'
        }

        return 'I\'m having trouble connecting to my AI service right now, but I\'m still here to help! Could you rephrase your question or ask about products, orders, account, or technical support?'
    }

    resetConversation() {
        this.conversationHistory = []
        this.initializeChat()
    }

    getConversationHistory(): GeminiChatMessage[] {
        return this.conversationHistory
    }
}

// Export singleton instance
export const geminiService = new GeminiService()
