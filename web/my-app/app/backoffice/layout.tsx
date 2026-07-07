'use client';
import Sidebar from "./sidebar";
export default function BackofficeLayout({ children }: { 
    children: React.ReactNode 
}) {
    return (
        <div className="app-shell">
            <Sidebar />
            <div className="app-main">
                <div className="app-content">
                    {children}
                </div>
            </div>
        </div>
    )
}
