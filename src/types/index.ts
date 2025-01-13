export interface Article {
  id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  search_query?: string;
}

export interface Topic {
  id: string;
  keyword: string;
  search_volume: number;
  last_updated: string;
}