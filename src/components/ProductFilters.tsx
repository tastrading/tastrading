"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ProductFiltersProps {
    brands: { id: string; name: string }[];
    categories: { id: string; name: string }[];
    selectedBrand?: string;
    selectedCategory?: string;
    selectedBrandName?: string;
    selectedCategoryName?: string;
    isMobileOnly?: boolean;
    isDesktopOnly?: boolean;
}

export default function ProductFilters({
    brands,
    categories,
    selectedBrand,
    selectedCategory,
    selectedBrandName,
    selectedCategoryName,
    isMobileOnly = false,
    isDesktopOnly = false,
}: ProductFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const activeFiltersCount = (selectedBrand ? 1 : 0) + (selectedCategory ? 1 : 0);

    // Desktop Only - Sidebar
    if (isDesktopOnly) {
        return (
            <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Filters</h3>
                        {activeFiltersCount > 0 && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                {activeFiltersCount} active
                            </span>
                        )}
                    </div>

                    {/* Active Filter Tags */}
                    {activeFiltersCount > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-100">
                            {selectedBrandName && (
                                <Link
                                    href={`/products${selectedCategory ? `?category=${selectedCategory}` : ""}`}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full hover:bg-emerald-100 transition-colors"
                                >
                                    {selectedBrandName}
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Link>
                            )}
                            {selectedCategoryName && (
                                <Link
                                    href={`/products${selectedBrand ? `?brand=${selectedBrand}` : ""}`}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full hover:bg-emerald-100 transition-colors"
                                >
                                    {selectedCategoryName}
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Brand Filter */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Brand</h4>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                            <Link
                                href="/products"
                                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!selectedBrand
                                        ? "bg-emerald-50 text-emerald-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                All Brands
                            </Link>
                            {brands.map((b) => (
                                <Link
                                    key={b.id}
                                    href={`/products?brand=${b.id}${selectedCategory ? `&category=${selectedCategory}` : ""}`}
                                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${selectedBrand === b.id
                                            ? "bg-emerald-50 text-emerald-700 font-medium"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {b.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                            <Link
                                href={`/products${selectedBrand ? `?brand=${selectedBrand}` : ""}`}
                                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory
                                        ? "bg-emerald-50 text-emerald-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                All Categories
                            </Link>
                            {categories.map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/products?${selectedBrand ? `brand=${selectedBrand}&` : ""}category=${c.id}`}
                                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === c.id
                                            ? "bg-emerald-50 text-emerald-700 font-medium"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {(selectedBrand || selectedCategory) && (
                        <Link
                            href="/products"
                            className="mt-6 block w-full text-center py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            Clear All Filters
                        </Link>
                    )}
                </div>
            </aside>
        );
    }

    // Mobile Only - Filter Button + Sheet
    if (isMobileOnly) {
        return (
            <>
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-6">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                        {activeFiltersCount > 0 && (
                            <span className="px-1.5 py-0.5 bg-emerald-600 text-white text-xs font-medium rounded-full min-w-[20px] text-center">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    {/* Active Filters Tags */}
                    {activeFiltersCount > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {selectedBrandName && (
                                <Link
                                    href={`/products${selectedCategory ? `?category=${selectedCategory}` : ""}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full hover:bg-emerald-100 transition-colors"
                                >
                                    {selectedBrandName}
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Link>
                            )}
                            {selectedCategoryName && (
                                <Link
                                    href={`/products${selectedBrand ? `?brand=${selectedBrand}` : ""}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full hover:bg-emerald-100 transition-colors"
                                >
                                    {selectedCategoryName}
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Filter Sheet */}
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-black/50 z-50"
                            />

                            {/* Sheet */}
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[85vh] overflow-hidden"
                            >
                                {/* Handle */}
                                <div className="flex justify-center py-3">
                                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                                </div>

                                {/* Header */}
                                <div className="flex items-center justify-between px-5 pb-4 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="px-5 py-4 overflow-y-auto max-h-[55vh]">
                                    {/* Brand Filter */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Brand</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                href={`/products${selectedCategory ? `?category=${selectedCategory}` : ""}`}
                                                onClick={() => setIsOpen(false)}
                                                className={`px-3 py-2 rounded-lg text-sm transition-all ${!selectedBrand
                                                        ? "bg-emerald-600 text-white font-medium"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                All
                                            </Link>
                                            {brands.map((b) => (
                                                <Link
                                                    key={b.id}
                                                    href={`/products?brand=${b.id}${selectedCategory ? `&category=${selectedCategory}` : ""}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`px-3 py-2 rounded-lg text-sm transition-all ${selectedBrand === b.id
                                                            ? "bg-emerald-600 text-white font-medium"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {b.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Category Filter */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Category</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                href={`/products${selectedBrand ? `?brand=${selectedBrand}` : ""}`}
                                                onClick={() => setIsOpen(false)}
                                                className={`px-3 py-2 rounded-lg text-sm transition-all ${!selectedCategory
                                                        ? "bg-emerald-600 text-white font-medium"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                All
                                            </Link>
                                            {categories.map((c) => (
                                                <Link
                                                    key={c.id}
                                                    href={`/products?${selectedBrand ? `brand=${selectedBrand}&` : ""}category=${c.id}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === c.id
                                                            ? "bg-emerald-600 text-white font-medium"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {c.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
                                    <Link
                                        href="/products"
                                        onClick={() => setIsOpen(false)}
                                        className="flex-1 py-3 text-center text-gray-700 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-sm"
                                    >
                                        Clear All
                                    </Link>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="flex-1 py-3 text-center text-white font-medium bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors text-sm"
                                    >
                                        Done
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
        );
    }

    // Default: render nothing if neither prop is set
    return null;
}
