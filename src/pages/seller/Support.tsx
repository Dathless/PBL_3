import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  Send
} from "lucide-react"
import SellerLayout from "./SellerLayout"

export default function SupportPage() {
  const { user } = useAuth()
  const [activeMenu, setActiveMenu] = useState("support")
  const [activeTab, setActiveTab] = useState("faq")

  const faqs = [
    {
      question: "How do I add a new product?",
      answer: "Go to the Products page and click the 'Add Product' button. Fill in the product details and save."
    },
    {
      question: "When will I receive my payout?",
      answer: "Payouts are processed weekly. You'll receive your earnings every Friday."
    },
    {
      question: "How do I update my business information?",
      answer: "Go to Settings > Business and update your information. Don't forget to save your changes."
    },
    {
      question: "What should I do if an order is cancelled?",
      answer: "Contact the customer first. If they confirm the cancellation, you can mark the order as cancelled in the Orders page."
    },
  ]

  const [ticket, setTicket] = useState({
    subject: "",
    message: ""
  })

  if (!user || user.role !== "seller") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Access denied. Please login as seller.</p>
      </div>
    )
  }

  return (
    <SellerLayout activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Support</h2>
          <p className="text-gray-600">Get help and contact support</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("faq")}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === "faq"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === "contact"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            Contact Us
          </button>
        </div>

        {activeTab === "faq" && (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-cyan-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "contact" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    value={ticket.subject}
                    onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                    placeholder="What can we help you with?"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    value={ticket.message}
                    onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                    rows={6}
                    placeholder="Describe your issue..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-700 transition"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Mail className="w-5 h-5 text-cyan-600 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Email Support</h3>
                    <p className="text-gray-600">support@sellerplatform.com</p>
                    <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Phone className="w-5 h-5 text-cyan-600 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Phone Support</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9AM-5PM EST</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-cyan-600 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Live Chat</h3>
                    <p className="text-gray-600">Available 24/7</p>
                    <button className="mt-2 text-cyan-600 hover:text-cyan-700 font-semibold">
                      Start Chat →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  )
}

