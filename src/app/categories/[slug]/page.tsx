import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import QuickSearch from "@/components/QuickSearch";
import Link from "next/link";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
        where: { id: slug },
        select: { name: true },
    });

    if (!category) {
        return { title: "Category Not Found | TAS Trading Corporation" };
    }

    return {
        title: `${category.name} | TAS Trading Corporation`,
        description: `Browse our selection of ${category.name}. Quality industrial tools and equipment from trusted manufacturers.`,
    };
}

async function getCategory(slug: string) {
    const category = await prisma.category.findUnique({
        where: { id: slug },
        include: {
            products: {
                where: { isArchived: false },
                include: {
                    images: { take: 1 },
                    brand: { select: { id: true, name: true } },
                },
                orderBy: [{ brand: { name: "asc" } }, { priority: "desc" }],
            },
        },
    });
    return category;
}

// Group products by brand
function groupProductsByBrand(products: any[]) {
    const grouped: Record<string, { brand: { id: string; name: string } | null; products: any[] }> = {};

    products.forEach((product) => {
        const brandKey = product.brand?.id || "no-brand";
        const brandName = product.brand?.name || "Other Products";

        if (!grouped[brandKey]) {
            grouped[brandKey] = {
                brand: product.brand || { id: "no-brand", name: "Other Products" },
                products: [],
            };
        }
        grouped[brandKey].products.push(product);
    });

    return Object.values(grouped).sort((a, b) =>
        (a.brand?.name || "").localeCompare(b.brand?.name || "")
    );
}

export default async function CategoryDetailPage({ params }: Props) {
    const { slug } = await params;
    const category = await getCategory(slug);

    if (!category) {
        notFound();
    }

    const groupedProducts = groupProductsByBrand(category.products);

    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center gap-2 text-sm text-gray-500">
                        <li>
                            <Link href="/" className="hover:text-emerald-600">
                                Home
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href="/categories" className="hover:text-emerald-600">
                                Categories
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">{category.name}</li>
                    </ol>
                </nav>

                {/* Category Header */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 mb-8 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">{category.name}</h1>
                            <p className="mt-2 text-emerald-100">
                                {category.products.length} Products from {groupedProducts.length} Brands
                            </p>
                        </div>
                        <QuickSearch placeholder="Search in category..." />
                    </div>
                </div>

                {/* Table of Contents */}
                {groupedProducts.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Navigation
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {groupedProducts.map((group) => (
                                <a
                                    key={group.brand?.id}
                                    href={`#brand-${group.brand?.id}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 rounded-full text-sm font-medium transition-colors"
                                >
                                    {group.brand?.name}
                                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                        {group.products.length}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Grouped by Brand */}
                {groupedProducts.length > 0 ? (
                    <div className="space-y-12">
                        {groupedProducts.map((group) => (
                            <section key={group.brand?.id} id={`brand-${group.brand?.id}`} className="scroll-mt-24">
                                {/* Brand Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <span className="text-emerald-600 font-bold">
                                                {group.brand?.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {group.brand?.name}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                {group.products.length} products
                                            </p>
                                        </div>
                                    </div>
                                    {group.brand?.id !== "no-brand" && (
                                        <Link
                                            href={`/brands/${group.brand?.id}`}
                                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                        >
                                            View all {group.brand?.name} products →
                                        </Link>
                                    )}
                                </div>

                                {/* Products Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {group.products.map((product: any) => (
                                        <ProductCard
                                            key={product.id}
                                            product={{
                                                ...product,
                                                price: product.price ? Number(product.price) : null,
                                                category: { name: category.name },
                                            }}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl">
                        <p className="text-gray-500">
                            No products available in this category yet.
                        </p>
                    </div>
                )}

                {/* Back to top */}
                <div className="mt-12 text-center">
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        Back to top
                    </a>
                </div>
            </div>
        </div>
    );
}
