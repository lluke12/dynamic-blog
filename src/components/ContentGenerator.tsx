'use client'

import { useEffect, useState } from 'react';
import type { Article } from '@/types';

interface ContentGeneratorProps {
  topic: string;
}

export function ContentGenerator({ topic }: ContentGeneratorProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topic) return;

    const generateContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic })
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to generate content');
        }

        setArticle(data.article);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    generateContent();
  }, [topic]);

  if (loading) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
        Generating content...
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-red-200 bg-red-50 rounded-lg p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!article) {
    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
        Zoek naar een onderwerp om content te genereren
      </div>
    );
  }

  return (
    <article className="border rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
      <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: article.content }} />
      <div className="flex gap-2">
        {article.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}