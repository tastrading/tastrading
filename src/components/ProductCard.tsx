"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import QuoteRequestModal from "./QuoteRequestModal";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        description?: string | null;
        price: number | null;
        images: { url: string }[];
        brand?: { name: string } | null;
        category?: { name: string } | null;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const imageUrl = product.images[0]?.url || "/placeholder-product.jpg";

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
                <Link href={`/products/${product.id}`}>
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Quick View Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-full shadow-lg">
                                View Details
                            </span>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.brand && (
                                <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                                    {product.brand.name}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        {product.category && (
                            <p className="text-xs text-emerald-600 font-medium mb-2 uppercase tracking-wide">
                                {product.category.name}
                            </p>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                            {product.name}
                        </h3>
                        {product.description && (
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                {product.description.replace(/<[^>]*>/g, "").slice(0, 100)}...
                            </p>
                        )}

                        {/* Price */}
                        <div className="mb-3">
                            {product.price ? (
                                <span className="text-lg font-bold text-gray-900">
                                    ₹{product.price.toLocaleString("en-IN")}
                                </span>
                            ) : (
                                <span className="text-sm text-gray-500">Price on Request</span>
                            )}
                        </div>
                    </div>
                </Link>

                {/* Enquire Button - Outside the link */}
                <div className="px-5 pb-5">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsQuoteModalOpen(true);
                        }}
                        className="w-full py-2.5 px-4 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Enquire Now
                    </button>
                </div>
            </motion.div>

            {/* Quote Request Modal */}
            <QuoteRequestModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                productName={product.name}
                productId={product.id}
            />
        </>
    );
}
