import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import slugify from 'slugify';

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    const slug = slugify(topic, { lower: true });

    // Check for existing
    const { data: existing } = await supabase
      .from('articles')
      .select()
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json({ success: true, article: existing });
    }

    // Generate new
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Je bent een expert in webontwikkeling. Schrijf een informatief artikel in het Nederlands."
        },
        {
          role: "user",
          content: `Schrijf een artikel over: ${topic}`
        }
      ],
    });

    const content = completion.choices[0].message.content || '';

    const article = {
      title: topic,
      content,
      slug,
      tags: ['webontwikkeling'],
      search_query: topic,
    };

    const { data, error } = await supabase
      .from('articles')
      .insert(article)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, article: data });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate' }, { status: 500 });
  }
}