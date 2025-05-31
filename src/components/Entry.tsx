import {EntryType} from '../types/entry';
import React from 'react';

interface EntryProps {
    entry: EntryType;
}

// Entry is a functional component (FC) that expects props in a format EntryProps
const Entry: React.FC<EntryProps> = (props) => {
  return (
    <article className="p-6 mb-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-white hover:border-gray-300">
      <div className="flex flex-col space-y-4">
        {/* Header with country and Goodreads link */}
        <div className="flex justify-between items-start">
          <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">
            {props.entry.country_id}
          </span>
          <a
            href={props.entry.goodreads_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
          >
            <span className="group-hover:underline">View on Goodreads</span>
            <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Book details */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 leading-tight">
            {props.entry.title}
          </h2>
          
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="font-medium">{props.entry.author}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>{props.entry.year}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(props.entry.rating)
                    ? 'text-amber-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-medium text-amber-600 ml-1">
            {props.entry.rating}
          </span>
        </div>
      </div>
    </article>
  );
};

export default Entry;
