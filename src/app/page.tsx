'use client'

import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { TrendingTopics } from '@/components/TrendingTopics';
import { ContentGenerator } from '@/components/ContentGenerator';

export default function Home() {
  const [topic, setTopic] = useState('');

  const handleSearch = (query: string) => {
    setTopic(query);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Web Development Blog</h1>
        <SearchBar onSearch={handleSearch} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <ContentGenerator topic={topic} />
          </div>
          <div>
            <TrendingTopics onTopicSelect={setTopic} />
          </div>
        </div>
      </div>
    </main>
  );
}