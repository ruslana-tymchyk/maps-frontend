import {EntryType} from '../types/entry';
import React from 'react';

interface EntryProps {
    entry: EntryType;
}

// Entry is a functional component (FC) that expects props in a format EntryProps
const Entry: React.FC<EntryProps> = (props) => {
    return(
    <article className="p-4 mb-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <div className="flex flex-col">
                <div className="flex justify-between items-start mb-3"> 
                    <span 
                        className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                            {props.entry.country_id}
                    </span>
                    <a 
                        href={props.entry.goodreads_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                        View on Goodreads
                    </a>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mt-2 mb-1">
                    {props.entry.title}
                </h2>
                
                <p className="text-sm text-gray-600">
                    {props.entry.author}
                </p>
                
                <p className="text-sm text-gray-600">
                    {props.entry.year}
                </p>
                
                <p className="text-sm font-medium text-amber-500 mt-2">
                    {props.entry.rating}
                </p>
            </div>
    </article>);
};

export default Entry;
