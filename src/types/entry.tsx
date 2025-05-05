export interface EntryType {
    id: number;
    country_id: string;
    title: string;
    author: string;
    year: number;
    rating: number;
    created_at: string;
    goodreads_url: string;
    // add more specific fields instead of [key: string]: any
  }
  