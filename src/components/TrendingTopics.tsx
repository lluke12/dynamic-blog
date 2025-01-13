'use client'

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import type { Topic } from '@/types';

interface TrendingTopicsProps {
  onTopicSelect: (topic: string) => void;
}

export function TrendingTopics({ onTopicSelect }: TrendingTopicsProps) {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/trending');
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
    const interval = setInterval(fetchTopics, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Trending Topics
      </h2>
      <ul className="space-y-4">
        {topics.map((topic) => (
          <li
            key={topic.id}
            onClick={() => onTopicSelect(topic.keyword)}
            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
          >
            <span>{topic.keyword}</span>
            <span className="text-sm text-gray-500">{topic.search_volume}+</span>
          </li>
        ))}
      </ul>
    </div>
  );
}