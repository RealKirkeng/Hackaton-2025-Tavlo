
import React from 'react';
import { Note } from '../data/content';
import { SearchIcon } from './Icons';

export interface SearchResult {
    note: Note;
    subject: string;
}

interface SearchViewProps {
    query: string;
    results: SearchResult[];
    onSelectResult: (result: SearchResult) => void;
}

const Highlight: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
    if (!highlight.trim()) {
        return <>{text}</>;
    }
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 text-black rounded px-0 py-0">{part}</mark>
                ) : (
                    part
                )
            )}
        </>
    );
};


const SearchResultCard: React.FC<{ result: SearchResult; query: string; onClick: () => void }> = ({ result, query, onClick }) => {
    return (
        <button onClick={onClick} className="w-full text-left bg-white p-4 rounded-lg border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-gray-800 truncate">
                    <Highlight text={result.note.title} highlight={query} />
                </p>
                <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full flex-shrink-0 ml-2">{result.subject}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                <Highlight text={result.note.studentAnswer} highlight={query} />
            </p>
        </button>
    );
};


const SearchView: React.FC<SearchViewProps> = ({ query, results, onSelectResult }) => {
    return (
        <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-stone-100 flex flex-col">
            <header className="mb-6 pb-4 border-b border-stone-300">
                <h2 className="font-serif text-2xl md:text-3xl text-gray-800 font-semibold">
                    Søkeresultater for <span className="text-blue-600">"{query}"</span>
                </h2>
                <p className="text-gray-600 mt-1">{results.length} treff funnet.</p>
            </header>
            
            {results.length > 0 ? (
                <div className="space-y-3">
                    {results.map(result => (
                        <SearchResultCard 
                            key={result.note.id} 
                            result={result} 
                            query={query}
                            onClick={() => onSelectResult(result)} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-16 flex flex-col items-center">
                    <SearchIcon className="w-12 h-12 text-gray-400 mb-4"/>
                    <p>Ingen resultater funnet for "{query}".</p>
                    <p className="text-sm mt-1">Prøv et annet søkeord.</p>
                </div>
            )}
        </main>
    );
};

export default SearchView;
