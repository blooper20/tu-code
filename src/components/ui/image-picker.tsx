"use client";

import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ImagePickerProps {
    name: string;
    label: string;
    defaultValue?: string;
    onImageSet?: () => void;
    onImageRemove?: () => void;
}

export default function ImagePicker({ name, label, defaultValue, onImageSet, onImageRemove }: ImagePickerProps) {
    const [preview, setPreview] = useState<string | null>(defaultValue || null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onImageSet?.();
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        setPreview(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        onImageRemove?.();
    };

    const handlePickClick = (e: React.MouseEvent) => {
        e.preventDefault();
        inputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">{label}</label>
            <div className={`
                relative flex flex-col items-center justify-center w-full min-h-[200px] 
                rounded-xl border-2 border-dashed transition-all overflow-hidden
                ${preview
                    ? 'border-primary-500/50 bg-surface-2'
                    : 'border-surface-3 bg-surface-1 hover:bg-surface-2 hover:border-primary-500/50 cursor-pointer'
                }
            `}>
                <input
                    ref={inputRef}
                    type="file"
                    name={name}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />

                {preview ? (
                    <div className="relative w-full h-[200px]">
                        <Image
                            src={preview}
                            alt="Thumbnail preview"
                            fill
                            className="object-cover"
                        />
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={handlePickClick}
                        className="flex flex-col items-center justify-center p-6 text-center w-full h-full"
                    >
                        <div className="p-4 rounded-full bg-surface-2 mb-4">
                            <ImagePlus className="h-8 w-8 text-text-secondary" />
                        </div>
                        <p className="text-sm font-medium text-text-primary">
                            클릭하여 이미지 업로드
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                            PNG, JPG, GIF (권장: 1200x630px)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
