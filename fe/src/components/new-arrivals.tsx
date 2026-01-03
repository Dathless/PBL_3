"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { useBuyNow } from "@/contexts/buy-now-context"
import { AddToCartModal } from "@/components/add-to-cart-modal"
import { productApi } from "@/lib/api"

interface Product {
    id: string
    name: string
    image: string
    price: number
    originalPrice?: number
    stock: number
    status: string
    discount?: number
}

export function NewArrivals() {
    const navigate = useNavigate()
    const { setBuyNowProduct } = useBuyNow()
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    // Load products from backend
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true)
                // Fetch all approved products
                const allProducts = await productApi.getAll()

                // Sort by createdAt desc and take first 8
                const sortedProducts = allProducts
                    .sort((a: any, b: any) => {
                        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                    })
                    .slice(0, 8)

                const productList: Product[] = sortedProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    image: p.images && p.images.length > 0 ? p.images[0].imageUrl : "/placeholder.svg",
                    price: Number(p.discount) > 0
                        ? Number(p.price) * (1 - Number(p.discount) / 100)
                        : Number(p.price),
                    originalPrice: Number(p.price),
                    stock: Number(p.stock) || 0,
                    status: p.status || "AVAILABLE",
                    discount: Number(p.discount) || 0
                }))

                setProducts(productList)
            } catch (error) {
                console.error("Error loading new arrivals:", error)
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [])

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault()
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    const handleBuyNow = (e: React.MouseEvent, product: Product) => {
        e.preventDefault()
        setBuyNowProduct({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
        })
        navigate("/buy-now")
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <p className="text-gray-500">Loading new arrivals...</p>
            </div>
        )
    }

    if (products.length === 0) {
        return null
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold uppercase tracking-tight">New Arrivals</h2>
                <Link
                    to="/category/all"
                    className="bg-amber-400 text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-amber-500 transition shadow-sm"
                >
                    VIEW ALL
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                        {/* Product Image */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                            <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                <span className="bg-cyan-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                    New
                                </span>
                                {product.discount !== undefined && product.discount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                        {product.discount}% OFF
                                    </span>
                                )}
                            </div>

                            {/* Action Overlays */}
                            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/20 to-transparent">
                                <button
                                    onClick={(e) => handleAddToCart(e, product)}
                                    disabled={product.stock <= 0}
                                    className="w-full bg-white/90 backdrop-blur-sm text-black py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white transition"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    {product.stock <= 0 ? "SOLD OUT" : "ADD TO CART"}
                                </button>
                            </div>

                            {/* Sold Out Overlay */}
                            {product.stock <= 0 && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                    <span className="border-2 border-red-500 text-red-500 font-black px-4 py-2 rounded-lg rotate-[-12deg] tracking-widest text-xl">
                                        SOLD OUT
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-cyan-600 transition min-h-[40px]">
                                {product.name}
                            </h3>

                            <div className="mt-auto">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl font-black text-red-500">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-sm text-gray-400 line-through">
                                            ${product.originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                                        Stock: {product.stock}
                                    </span>
                                    <button
                                        onClick={(e) => handleBuyNow(e, product)}
                                        disabled={product.stock <= 0}
                                        className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition ${product.stock <= 0
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-cyan-50 text-cyan-600 hover:bg-cyan-100"
                                            }`}
                                    >
                                        BUY NOW
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {isModalOpen && selectedProduct && (
                <AddToCartModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={selectedProduct}
                />
            )}
        </div>
    )
}
