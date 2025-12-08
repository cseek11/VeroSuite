import { supabase } from '../supabase-client';

export interface KnowledgeCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  slug: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category_id: string;
  author: string | null;
  publish_date: string | null;
  last_updated: string | null;
  read_time: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
  rating: number | null;
  views: number | null;
  tags: string[] | null;
  content: string;
  featured: boolean | null;
}

export async function fetchKnowledgeCategories(): Promise<KnowledgeCategory[]> {
  const { data, error } = await supabase
    .from('knowledge_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data as KnowledgeCategory[];
}

export async function fetchKnowledgeArticles(params?: { categorySlug?: string; search?: string }): Promise<KnowledgeArticle[]> {
  let query = supabase.from('knowledge_articles_view').select('*').order('publish_date', { ascending: false });

  if (params?.categorySlug) {
    query = query.eq('category_slug', params.categorySlug);
  }
  if (params?.search) {
    query = query.ilike('title', `%${params.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as KnowledgeArticle[];
}

export async function createKnowledgeArticle(input: Omit<KnowledgeArticle, 'id'>): Promise<KnowledgeArticle> {
  const { data, error } = await supabase
    .from('knowledge_articles')
    .insert([input])
    .select('*')
    .single();
  if (error) throw error;
  return data as KnowledgeArticle;
}

export async function updateKnowledgeArticle(id: string, updates: Partial<Omit<KnowledgeArticle, 'id'>>): Promise<KnowledgeArticle> {
  const { data, error } = await supabase
    .from('knowledge_articles')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as KnowledgeArticle;
}

export async function deleteKnowledgeArticle(id: string): Promise<void> {
  const { error } = await supabase
    .from('knowledge_articles')
    .delete()
    .eq('id', id);
  if (error) throw error;
}


