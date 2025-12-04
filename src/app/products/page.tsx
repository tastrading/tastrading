import { Metadata } from "next";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import QuickSearch from "@/components/QuickSearch";
import { siteConfig } from "@/lib/seo";

// Revalidate products page every 5 minutes
export const revalidate = 300;

export const metadata: Metadata = {
    title: "Products",
    description:
        "Browse our complete range of industrial tools and equipment. HSS Taps, Drilling Bits, Transmission Belts, CNC Tools, and more from premium brands.",
    openGraph: {
        title: "Products | TAS Trading Corporation",
        description:
            "Browse our complete range of industrial tools and equipment. HSS Taps, Drilling Bits, Transmission Belts, CNC Tools, and more from premium brands.",
        url: `${siteConfig.url}/products`,
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Products | TAS Trading Corporation",
        description: "Browse our complete range of industrial tools and equipment.",
    },
    alternates: {
        canonical: `${siteConfig.url}/products`,
    },
};

interface Props {
    searchParams: Promise<{ brand?: string; category?: string; search?: string }>;
}

async function getProducts(brandId?: string, categoryId?: string, searchQuery?: string) {
    const where = {
        isArchived: false,
        ...(brandId && { brandId }),
        ...(categoryId && { categoryId }),
        ...(searchQuery && {
            OR: [
                { name: { contains: searchQuery, mode: "insensitive" as const } },
                { description: { contains: searchQuery, mode: "insensitive" as const } },
            ],
        }),
    };

    const [products, brands, categories] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                images: { take: 1 },
                brand: { select: { name: true } },
                category: { select: { name: true } },
            },
            orderBy: { priority: "desc" },
        }),
        prisma.brand.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
        prisma.category.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
    ]);

    return { products, brands, categories };
}

export default async function ProductsPage({ searchParams }: Props) {
    const { brand, category, search } = await searchParams;
    const { products, brands, categories } = await getProducts(brand, category, search);

    // Get selected filter names
    const selectedBrandName = brand ? brands.find((b) => b.id === brand)?.name : undefined;
    const selectedCategoryName = category ? categories.find((c) => c.id === category)?.name : undefined;

    return (
        <div className="py-8 lg:py-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">
                        Our Products
                    </span>
                    <h1 className="mt-2 text-3xl lg:text-4xl font-bold text-gray-900">All Products</h1>
                    <p className="mt-2 text-gray-600">
                        Explore our comprehensive range of premium industrial tools and equipment
                    </p>
                </div>

                {/* Search Bar - Full Width */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <Suspense fallback={
                        <div className="relative flex-shrink-0 w-full sm:w-64">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                disabled
                                placeholder="Search products..."
                                className="w-full h-10 pl-10 pr-9 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none"
                            />
                        </div>
                    }>
                        <QuickSearch placeholder="Search products..." />
                    </Suspense>
                    <p className="text-sm text-gray-500 whitespace-nowrap">
                        {products.length} products{search && <span className="text-emerald-600"> matching &quot;{search}&quot;</span>}
                    </p>
                </div>

                {/* Mobile Filter Button + Active Filters */}
                <ProductFilters
                    brands={brands}
                    categories={categories}
                    selectedBrand={brand}
                    selectedCategory={category}
                    selectedBrandName={selectedBrandName}
                    selectedCategoryName={selectedCategoryName}
                    isMobileOnly={true}
                />

                <div className="flex gap-8">
                    {/* Desktop Sidebar Filters */}
                    <ProductFilters
                        brands={brands}
                        categories={categories}
                        selectedBrand={brand}
                        selectedCategory={category}
                        selectedBrandName={selectedBrandName}
                        selectedCategoryName={selectedCategoryName}
                        isDesktopOnly={true}
                    />

                    {/* Products Grid */}
                    <div className="flex-1">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            ...product,
                                            price: product.price ? Number(product.price) : null,
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
                                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
