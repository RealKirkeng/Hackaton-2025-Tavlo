import React, { useState, useEffect } from 'react';
import { CloseIcon, ClipboardIcon } from './Icons';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, content }) => {
    const [copyStatus, setCopyStatus] = useState('Kopier tekst');

    useEffect(() => {
        if (isOpen) {
            setCopyStatus('Kopier tekst');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(content).then(() => {
            setCopyStatus('Kopiert!');
            setTimeout(() => setCopyStatus('Kopier tekst'), 2000);
        }, () => {
            setCopyStatus('Feilet!');
        });
    };

    return (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-stone-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 max-h-[85vh]">
                <header className="flex items-center justify-between p-4 border-b border-stone-200 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Del Notat</h2>
                        <p className="text-sm text-gray-600">Kopier innholdet for å dele det.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200">
                        <CloseIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </header>

                <div className="flex-grow p-4 md:p-6 overflow-y-auto">
                    <textarea
                        readOnly
                        value={content}
                        className="w-full h-48 bg-stone-100 border border-stone-300 rounded-md p-3 resize-none font-serif text-gray-700"
                    />
                </div>

                 <footer className="p-4 border-t border-stone-200 flex-shrink-0 flex justify-end">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        <ClipboardIcon className="w-5 h-5" />
                        {copyStatus}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ShareModal;