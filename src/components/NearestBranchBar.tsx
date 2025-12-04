"use client";

import { useEffect, useState, useCallback } from "react";
import { offices, findNearestOffice, calculateDistance, getWhatsAppLink, type Office } from "@/lib/offices";

type LocationStatus = "ready" | "prompt" | "denied";

interface CachedLocation {
    lat: number;
    lng: number;
    timestamp: number;
}

const CACHE_KEY = "tas_user_location";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const LOCATION_TIMEOUT = 5000; // 5 seconds max

export default function NearestBranchBar() {
    const [nearestOffice, setNearestOffice] = useState<Office>(offices[0]);
    const [distance, setDistance] = useState<number | null>(null);
    const [hasLocation, setHasLocation] = useState(false);
    const [locationStatus, setLocationStatus] = useState<LocationStatus>("ready");
    const [isDismissed, setIsDismissed] = useState(false);

    const updateFromCoords = useCallback((lat: number, lng: number) => {
        const nearest = findNearestOffice(lat, lng);
        if (nearest) {
            setNearestOffice(nearest);
            setDistance(calculateDistance(lat, lng, nearest.coordinates.lat, nearest.coordinates.lng));
            setHasLocation(true);
        }
    }, []);

    const cacheLocation = useCallback((lat: number, lng: number) => {
        try {
            const cached: CachedLocation = { lat, lng, timestamp: Date.now() };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
        } catch {
            // localStorage might not be available
        }
    }, []);

    const getCachedLocation = useCallback((): CachedLocation | null => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed: CachedLocation = JSON.parse(cached);
                // Check if cache is still valid
                if (Date.now() - parsed.timestamp < CACHE_DURATION) {
                    return parsed;
                }
            }
        } catch {
            // localStorage might not be available
        }
        return null;
    }, []);

    useEffect(() => {
        // Check if dismissed
        try {
            if (sessionStorage.getItem("locationBannerDismissed")) {
                setIsDismissed(true);
            }
        } catch {
            // sessionStorage might not be available
        }

        // Try cached location first for instant display
        const cached = getCachedLocation();
        if (cached) {
            updateFromCoords(cached.lat, cached.lng);
        }

        // Check if geolocation available
        if (!("geolocation" in navigator)) {
            return;
        }

        // Check permission state
        if ("permissions" in navigator) {
            navigator.permissions.query({ name: "geolocation" }).then((result) => {
                if (result.state === "granted") {
                    // Already granted - fetch location
                    fetchLocation();
                } else if (result.state === "denied") {
                    setLocationStatus("denied");
                } else {
                    // Prompt state - only show prompt if no cache
                    if (!cached) {
                        setLocationStatus("prompt");
                    }
                }
            }).catch(() => {
                // Permissions API failed, try location directly if we have cache
                if (cached) {
                    fetchLocation();
                }
            });
        } else if (cached) {
            // No permissions API but have cache, refresh in background
            fetchLocation();
        }
    }, [getCachedLocation, updateFromCoords]);

    const fetchLocation = useCallback(() => {
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            // If still no location after timeout, keep using default/cache
            console.log("Location timeout - using fallback");
        }, LOCATION_TIMEOUT);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(timeoutId);
                const { latitude, longitude } = position.coords;
                updateFromCoords(latitude, longitude);
                cacheLocation(latitude, longitude);
            },
            (error) => {
                clearTimeout(timeoutId);
                console.log("Geolocation error:", error.code);
                if (error.code === 1) {
                    setLocationStatus("denied");
                }
            },
            {
                enableHighAccuracy: false,
                timeout: LOCATION_TIMEOUT,
                maximumAge: CACHE_DURATION,
            }
        );
    }, [updateFromCoords, cacheLocation]);

    const handleEnableLocation = () => {
        setLocationStatus("ready");
        fetchLocation();
    };

    const handleDismiss = () => {
        setIsDismissed(true);
        try {
            sessionStorage.setItem("locationBannerDismissed", "true");
        } catch {
            // sessionStorage might not be available
        }
    };

    const contact = nearestOffice.contacts[0];

    const formatDistance = (km: number) => {
        if (km < 1) return `${Math.round(km * 1000)}m away`;
        return `${km.toFixed(1)}km away`;
    };

    // Show prompt banner if location not yet granted
    if (locationStatus === "prompt" && !isDismissed && !hasLocation) {
        return (
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2 px-4">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="hidden sm:inline">Enable location to find your nearest branch</span>
                        <span className="sm:hidden">Find nearest branch</span>
                    </div>
                    <button
                        onClick={handleEnableLocation}
                        className="px-3 py-1 bg-white text-emerald-700 rounded-full text-xs font-semibold hover:bg-emerald-50 transition-colors"
                    >
                        Enable
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Dismiss"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    // Normal display with branch info
    if (!contact) return null;

    return (
        <div className="bg-gray-900 text-white py-2 px-4">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
                {/* Location Info */}
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{nearestOffice.name}</span>
                    {distance && hasLocation ? (
                        <span className="text-gray-400 text-xs">({formatDistance(distance)})</span>
                    ) : (
                        <span className="text-gray-500 text-xs">(Head Office)</span>
                    )}
                </div>

                <span className="text-gray-600 hidden sm:inline">|</span>

                {/* Contact Person - hide on very small screens */}
                <div className="hidden xs:flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-300">{contact.name}</span>
                </div>

                {/* Phone & WhatsApp */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                    >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-medium hidden sm:inline">{contact.phone}</span>
                        <span className="font-medium sm:hidden">Call</span>
                    </a>

                    <a
                        href={getWhatsAppLink(contact.phone, "Hi, I'm visiting your website and would like to inquire about products.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2 py-0.5 bg-green-600 hover:bg-green-500 rounded-full transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span className="text-xs font-medium">WhatsApp</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
