"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const value = {
        toast: addToast,
        success: (msg: string) => addToast(msg, "success"),
        error: (msg: string) => addToast(msg, "error"),
    };

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <ToastContext.Provider value={value}>
            {children}
            {mounted && createPortal(
                <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                    <AnimatePresence mode="popLayout">
                        {toasts.map((t) => (
                            <ToastItem key={t.id} toast={t} onRemove={removeToast} />
                        ))}
                    </AnimatePresence>
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-orange-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />,
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="pointer-events-auto min-w-[300px] max-w-sm flex items-start gap-3 p-4 bg-[#0A0A0E] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md"
        >
            <div className="mt-0.5">{icons[toast.type]}</div>
            <p className="flex-1 text-sm font-medium text-white/90 leading-relaxed">{toast.message}</p>
            <button onClick={() => onRemove(toast.id)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
