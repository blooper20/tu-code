"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollTriggerProps {
    onTrigger: () => void;
    loading: boolean;
    hasMore: boolean;
}

export default function InfiniteScrollTrigger({
    onTrigger,
    loading,
    hasMore
}: InfiniteScrollTriggerProps) {
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    onTrigger();
                }
            },
            { threshold: 0.1 }
        );

        if (triggerRef.current) {
            observer.observe(triggerRef.current);
        }

        return () => observer.disconnect();
    }, [onTrigger, hasMore, loading]);

    if (!hasMore) return null;

    return (
        <div ref={triggerRef} className="flex justify-center py-8">
            {loading && (
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            )}
        </div>
    );
}
