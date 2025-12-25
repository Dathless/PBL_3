import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/lite-header'
import { LiteFooter } from '@/components/lite-footer'
import { ShoppingCart } from 'lucide-react'
import { productApi } from '@/lib/api'

interface Product {
    id: string
    name: string
    image: string
    price: number
    originalPrice: number
    discount: number
}

export default function Deals() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true)
                const discountedProducts = await productApi.getDiscounted()

                const productList: Product[] = discountedProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    image: p.images && p.images.length > 0 ? p.images[0].imageUrl : '/placeholder.svg',
                    // p.price is original price
                    price: Number(p.price) * (1 - Number(p.discount) / 100),
                    originalPrice: Number(p.price),
                    discount: Number(p.discount)
                }))

                setProducts(productList)
            } catch (error) {
                console.error('Error loading products:', error)
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [])

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Today's Deals</h1>
                    <p className="text-gray-600">Discover amazing deals on all products</p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading deals...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No deals available at the moment</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition group">
                                <Link to={`/product/${product.id}`} className="block">
                                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                        <span className="absolute top-3 left-3 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
                                            SALE
                                        </span>
                                        <img
                                            src={product.image || '/placeholder.svg'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                </Link>

                                <div className="p-4">
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="font-bold text-gray-900 line-clamp-2 hover:text-cyan-600 transition mb-2">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-red-600 font-bold text-lg">${product.price.toFixed(2)}</span>
                                        <span className="text-gray-400 line-through text-sm">${product.originalPrice.toFixed(2)}</span>
                                        <span className="text-green-600 text-xs font-semibold">
                                            {product.discount}% OFF
                                        </span>
                                    </div>

                                    <Link
                                        to={`/product/${product.id}`}
                                        className="w-full bg-cyan-500 text-white py-2.5 rounded-full font-bold text-sm hover:bg-cyan-600 transition flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        View Product
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <LiteFooter />
        </main>
    )
}
