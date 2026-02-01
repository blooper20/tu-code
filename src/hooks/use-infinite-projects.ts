"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";

const PAGE_SIZE = 9;

export function useInfiniteProjects(initialCategory: string = "All") {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [category, setCategory] = useState(initialCategory);

    const fetchProjects = useCallback(async (pageNum: number, currentCategory: string, append = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        const from = pageNum * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let query = supabase
            .from("projects")
            .select("*")
            .order("order_index", { ascending: true })
            .order("created_at", { ascending: false })
            .range(from, to);

        if (currentCategory && currentCategory !== "All") {
            query = query.eq("category", currentCategory);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching projects:", error);
            setLoading(false);
            setLoadingMore(false);
            return;
        }

        if (data) {
            if (append) {
                setProjects(prev => [...prev, ...data]);
            } else {
                setProjects(data);
            }
            setHasMore(data.length === PAGE_SIZE);
        } else {
            setHasMore(false);
        }

        setLoading(false);
        setLoadingMore(false);
    }, []);

    // 카테고리가 변경되면 초기화 및 재조회
    useEffect(() => {
        setPage(0);
        setProjects([]);
        setHasMore(true);
        fetchProjects(0, category, false);
    }, [category, fetchProjects]);

    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProjects(nextPage, category, true);
        }
    }, [page, loadingMore, hasMore, category, fetchProjects]);

    return {
        projects,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        category,
        setCategory
    };
}
