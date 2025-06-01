export interface EntryType {
    id: number;
    country_id: string;
    title: string;
    author: string;
    year: number;
    rating: number;
    created_at: string;
    google_url: string;
    book_summary: string;
    // add more specific fields instead of [key: string]: any
  }
  