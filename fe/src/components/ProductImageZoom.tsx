import { useState, MouseEvent } from "react"

interface ProductImageZoomProps {
    src: string
    alt: string
}

export function ProductImageZoom({ src, alt }: ProductImageZoomProps) {
    const [zoom, setZoom] = useState({ x: 0, y: 0, show: false })

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100
        setZoom({ x, y, show: true })
    }

    const handleMouseLeave = () => {
        setZoom({ ...zoom, show: false })
    }

    return (
        <div
            className="relative bg-gray-100 rounded-lg aspect-square mb-6 overflow-hidden cursor-zoom-in group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-contain mix-blend-multiply transition-opacity duration-200 ${zoom.show ? "opacity-0" : "opacity-100"
                    }`}
            />
            {zoom.show && (
                <div
                    className="absolute inset-0 bg-no-repeat pointer-events-none"
                    style={{
                        backgroundImage: `url(${src})`,
                        backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                        backgroundSize: "200%",
                        mixBlendMode: "multiply"
                    }}
                />
            )}
        </div>
    )
}
