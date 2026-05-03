'use client'

interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export default function Modal({ title, children, isOpen, onClose }: ModalProps) {
    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-5 rounded-lg shadow-lg w-1/2">
                    <h2 className="text-xl mb-4 bg-teal-600 text-white p-4 rounded-t-lg">
                        {title}
                        <button onClick={onClose} className="float-right text-gray-300">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        </h2>
                    <div className="mt-4 p-5">
                        {children}
                    </div>
                    
                </div>
            </div>
        )
    )
}
