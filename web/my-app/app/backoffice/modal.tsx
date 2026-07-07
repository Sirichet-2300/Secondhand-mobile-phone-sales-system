'use client'

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    title: string;
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export default function Modal({ title, children, isOpen, onClose }: ModalProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !isOpen) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/55 px-4 py-8 text-slate-900 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
                    <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-200 hover:text-slate-900">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="max-h-[75vh] overflow-auto p-6 text-slate-900">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}
