import { NextResponse } from 'next/server';
import googleTrends from 'google-trends-api';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const results = await googleTrends.dailyTrends({
      geo: 'NL',
    });
    
    const data = JSON.parse(results);
    const topics = data.default.trendingSearchesDays[0].trendingSearches
      .filter((topic: any) => {
        const keywords = ['web', 'development', 'programming', 'code', 'software'];
        return keywords.some(keyword => 
          topic.title.query.toLowerCase().includes(keyword)
        );
      })
      .slice(0, 5)
      .map((topic: any) => ({
        keyword: topic.title.query,
        search_volume: parseInt(topic.formattedTraffic.replace('K+', '000').replace('M+', '000000')) || 1000,
      }));

    // Store in Supabase
    for (const topic of topics) {
      await supabase
        .from('topics')
        .upsert({
          keyword: topic.keyword,
          search_volume: topic.search_volume,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'keyword'
        });
    }

    return NextResponse.json(topics);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
}