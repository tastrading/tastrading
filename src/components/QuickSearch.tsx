"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface QuickSearchProps {
    placeholder?: string;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function QuickSearch({ placeholder = "Search products..." }: QuickSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync with URL after mount
    useEffect(() => {
        setHasMounted(true);
        const currentSearch = searchParams.get("search");
        if (currentSearch) {
            setQuery(currentSearch);
        }
    }, [searchParams]);

    // Debounce the query with 400ms delay
    const debouncedQuery = useDebounce(query, 400);

    // Navigate when debounced query changes (only after mount)
    useEffect(() => {
        if (!hasMounted) return;

        const trimmedQuery = debouncedQuery.trim();
        const currentSearch = searchParams.get("search") || "";

        if (trimmedQuery !== currentSearch) {
            const params = new URLSearchParams(searchParams.toString());

            if (trimmedQuery) {
                params.set("search", trimmedQuery);
                setIsSearching(true);
            } else {
                params.delete("search");
            }

            router.push(`/products?${params.toString()}`);
            setTimeout(() => setIsSearching(false), 300);
        }
    }, [debouncedQuery, hasMounted, router, searchParams]);

    // Clear search
    const handleClear = useCallback(() => {
        setQuery("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("search");
        router.push(`/products?${params.toString()}`);
    }, [router, searchParams]);

    // Render same structure on both server and client
    return (
        <div className="relative flex-shrink-0 w-full sm:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {isSearching ? (
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                )}
            </div>

            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full h-10 pl-10 pr-9 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />

            {query && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
                    aria-label="Clear search"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
