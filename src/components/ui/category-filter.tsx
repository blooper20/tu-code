"use client";

import { motion } from "framer-motion";

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
    categories,
    selectedCategory,
    onSelectCategory,
}: CategoryFilterProps) {
    return (
        <div className="flex justify-center mb-12">
            <div className="flex flex-wrap justify-center gap-3 p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm max-w-full overflow-x-auto">
                <button
                    onClick={() => onSelectCategory("All")}
                    className={`
                        relative px-6 py-2 rounded-full text-sm font-bold transition-colors
                        ${selectedCategory === "All" ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"}
                    `}
                >
                    {selectedCategory === "All" && (
                        <motion.div
                            layoutId="activeCategory"
                            className="absolute inset-0 bg-primary-500 rounded-full"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">ALL</span>
                </button>

                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={`
                            relative px-6 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap
                            ${selectedCategory === category ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"}
                        `}
                    >
                        {selectedCategory === category && (
                            <motion.div
                                layoutId="activeCategory"
                                className="absolute inset-0 bg-primary-500 rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 uppercase">{category}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
