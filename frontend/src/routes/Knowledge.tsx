import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import { useDialog } from '@/hooks/useDialog';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Eye, 
  Download, 
  Filter,
  User,
  Star,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  FileText,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  FolderOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { fetchKnowledgeArticles, fetchKnowledgeCategories, createKnowledgeArticle, updateKnowledgeArticle, deleteKnowledgeArticle } from '../lib/services/knowledgeService';

// Real data will be fetched from API

// Articles will be fetched from API

const KnowledgePage: React.FC = () => {
  const { showConfirm, DialogComponents } = useDialog();
  const { user } = useAuthStore();
  const isAdmin = !!(user && Array.isArray(user.roles) && user.roles.includes('admin'));
  const [activeTab, setActiveTab] = useState('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [fetchedArticles, setFetchedArticles] = useState<any[]>([]);
  const [fetchedCategories, setFetchedCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editorData, setEditorData] = useState<any>({
    id: undefined,
    title: '',
    category_id: '',
    author: 'VeroField Team',
    read_time: '5 min',
    difficulty: 'beginner',
    tags: [],
    content: '',
    featured: false
  });
  const editorRef = useRef<HTMLDivElement | null>(null);

  const tabs = [
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'verofield', label: 'VeroField', icon: BookOpen },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'favorites', label: 'Favorites', icon: Bookmark }
  ];

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [cats, arts] = await Promise.all([
          fetchKnowledgeCategories().catch(() => []),
          fetchKnowledgeArticles().catch(() => [])
        ]);
        if (!isMounted) return;
        if (cats && cats.length) setFetchedCategories(cats);
        if (arts && arts.length) setFetchedArticles(arts);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load knowledge base');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'intermediate': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'advanced': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const usingFetched = fetchedArticles.length > 0;
  const categories = usingFetched ? fetchedCategories : mockCategories;
  const articles = usingFetched ? fetchedArticles : (mockArticles as any[]);

  const filteredArticles = articles.filter((article: any) => {
    const title = (article.title || '').toLowerCase();
    const matchesTitle = title.includes(searchQuery.toLowerCase());
    if (selectedCategory === 'all') return matchesTitle;
    if (usingFetched) {
      return matchesTitle && article.category_slug === selectedCategory;
    }
    return matchesTitle && article.category === selectedCategory;
  });

  const filteredFaqs = mockFaqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryArticles = (categoryId: string) => {
    return mockArticles.filter(article => article.category === categoryId);
  };

  return (
    <>
      <DialogComponents />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Knowledge Base
            </h1>
            <p className="text-slate-600 text-sm">
              Access pest control guides, safety protocols, and best practices
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm">
              <Download className="h-3 w-3" />
              Export
            </button>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm"
              onClick={() => {
                setEditorData({ id: undefined, title: '', category_id: (fetchedCategories.find((c:any)=>c.slug==='verofield-training')?.id)||'', author: 'VeroField Team', read_time: '5 min', difficulty: 'beginner', tags: [], content: '', featured: false });
                setIsEditorOpen(true);
              }}
            >
              <Plus className="h-3 w-3" />
              New Article
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl font-bold mb-1">{mockArticles.length}</div>
            <div className="text-blue-100 font-medium text-xs">Total Articles</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <FolderOpen className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl font-bold mb-1">{mockCategories.length}</div>
            <div className="text-emerald-100 font-medium text-xs">Categories</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Eye className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl font-bold mb-1">
              {mockArticles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}
            </div>
            <div className="text-violet-100 font-medium text-xs">Total Views</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Star className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl font-bold mb-1">
              {(mockArticles.reduce((sum, article) => sum + article.rating, 0) / mockArticles.length).toFixed(1)}
            </div>
            <div className="text-amber-100 font-medium text-xs">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles, FAQs, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-slate-200 rounded-lg px-2 py-1.5 min-w-[150px] bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.slug || category.id}>{category.name}</option>
            ))}
          </select>
          <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm">
            <Filter className="h-3 w-3" />
            Filters
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 overflow-hidden mb-4">
        <div className="flex space-x-4 overflow-x-auto border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 py-1 px-1 border-b-2 font-medium text-xs whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="h-3 w-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="space-y-3">
                  {activeTab === 'articles' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="p-1 bg-indigo-100 rounded-md">
                <FileText className="h-4 w-4 text-indigo-600" />
              </div>
              Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredArticles.map((article: any) => (
                <div
                  key={article.id}
                  className="p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedArticle(article); }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-600" />
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${getDifficultyColor(article.difficulty)}`}>
                        {article.difficulty}
                      </span>
                      {article.featured && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="prose max-w-none text-slate-600 text-xs line-clamp-3" dangerouslySetInnerHTML={{ __html: (article.content || '').slice(0, 800) }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-3">
                      <span>{article.read_time || article.readTime || ''}</span>
                      <span>{(article.views ?? 0)} views</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span>{Number(article.rating ?? 0).toFixed(1)}</span>
                      </div>
                    </div>
                    {getDifficultyIcon(article.difficulty)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-600">{article.author || 'VeroField Team'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isAdmin && (
                        <>
                          <button
                            className="h-6 px-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded hover:bg-white hover:shadow-lg transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditorData({
                                id: article.id,
                                title: article.title,
                                category_id: article.category_id || (fetchedCategories.find((c: any) => c.slug === article.category_slug)?.id || ''),
                                author: article.author || 'VeroField Team',
                                read_time: article.read_time || '5 min',
                                difficulty: article.difficulty || 'beginner',
                                tags: article.tags || [],
                                content: article.content || '',
                                featured: !!article.featured
                              });
                              setIsEditorOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="h-6 px-2 bg-white/80 backdrop-blur-sm border border-rose-200 text-rose-700 rounded hover:bg-white hover:shadow-lg transition-all duration-200"
                            onClick={async (e) => {
                              e.stopPropagation();
                              // Confirm dialog will be handled by showConfirm
                              try {
                                if (!article.id) return;
                                await deleteKnowledgeArticle(article.id);
                                const arts = await fetchKnowledgeArticles();
                                setFetchedArticles(arts);
                              } catch (err: unknown) {
                                logger.error('Failed to delete article', err, 'Knowledge');
                                toast.error('Failed to delete article');
                              }
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

          {activeTab === 'verofield' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-purple-100 rounded-md">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </div>
                VeroField Training
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {articles.filter((a: any) => (usingFetched ? a.category_slug === 'verofield-training' : a.category === 'verofield-training')).map((article: any) => (
                  <div
                    key={article.id}
                    className="p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm cursor-pointer"
                    onClick={() => setSelectedArticle(article)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedArticle(article); }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-600" />
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${getDifficultyColor(article.difficulty || 'beginner')}`}>
                          {article.difficulty || 'beginner'}
                        </span>
                        {article.featured && (
                          <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="prose max-w-none text-slate-600 text-xs line-clamp-3" dangerouslySetInnerHTML={{ __html: (article.content || '').slice(0, 800) }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <div className="flex items-center gap-3">
                        <span>{article.read_time || article.readTime || ''}</span>
                        <span>{(article.views ?? 0)} views</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500" />
                          <span>{Number(article.rating ?? 0).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-emerald-100 rounded-md">
                  <FolderOpen className="h-4 w-4 text-emerald-600" />
                </div>
                Categories
              </h2>
              <div className="space-y-3">
                {categories.map((category: any) => {
                  const isExpanded = expandedCategories.includes(category.id);
                  const categoryArticles = (usingFetched ? articles.filter((a: any) => a.category_slug === (category.slug || category.id)) : mockArticles.filter((a: any) => a.category === category.id));
                  
                  return (
                    <div key={category.id} className="border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                      <div 
                        className="p-3 cursor-pointer hover:bg-white/50 transition-colors"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{category.icon}</span>
                            <div>
                              <h3 className="text-sm font-semibold text-slate-900">
                                {category.name}
                              </h3>
                              <p className="text-xs text-slate-600">
                                {category.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">
                              {category.articleCount} articles
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-slate-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="border-t border-slate-200 p-3 bg-slate-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {categoryArticles.map((article) => (
                              <div key={article.id} className="p-3 bg-white rounded border border-slate-200">
                                <h4 className="text-sm font-semibold text-slate-900 mb-1">
                                  {article.title}
                                </h4>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                  <span>{article.readTime}</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-amber-500" />
                                    <span>{article.rating}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-amber-100 rounded-md">
                  <HelpCircle className="h-4 w-4 text-amber-600" />
                </div>
                FAQs
              </h2>
              <div className="space-y-3">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="p-3 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-slate-600" />
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                          faq.category === 'emergency' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {faq.category}
                        </span>
                      </div>
                      <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="mb-2">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">
                        {faq.question}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {faq.answer}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-emerald-500" />
                          <span>{faq.helpful} helpful</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsDown className="h-3 w-3 text-rose-500" />
                          <span>{faq.notHelpful} not helpful</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="h-6 px-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded hover:bg-white hover:shadow-lg transition-all duration-200">
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button className="h-6 px-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded hover:bg-white hover:shadow-lg transition-all duration-200">
                          <Share2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-violet-100 rounded-md">
                  <Bookmark className="h-4 w-4 text-violet-600" />
                </div>
                Favorites
              </h2>
              <div className="text-center py-8">
                <Bookmark className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  No Favorites Yet
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Start bookmarking articles and FAQs to access them quickly
                </p>
                <button 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm"
                  onClick={() => setActiveTab('articles')}
                >
                  Browse Articles
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedArticle.title}
                </h2>
                <button 
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200"
                  onClick={() => setSelectedArticle(null)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>By {selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                  <span>•</span>
                  <span>{selectedArticle.views} views</span>
                </div>
                <div className="prose max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: selectedArticle.content || '' }} />
                <div className="flex items-center gap-2">
                  {selectedArticle.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">{editorData.id ? 'Edit Article' : 'New Article'}</h2>
                <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200" onClick={() => setIsEditorOpen(false)}>Close</button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Title</label>
                  <input className="w-full border border-slate-200 rounded px-3 py-2 text-sm" value={editorData.title} onChange={(e) => setEditorData({ ...editorData, title: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Category</label>
                    <select className="w-full border border-slate-200 rounded px-3 py-2 text-sm" value={editorData.category_id} onChange={(e) => setEditorData({ ...editorData, category_id: e.target.value })}>
                      <option value="">Select category</option>
                      {fetchedCategories.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Difficulty</label>
                    <select className="w-full border border-slate-200 rounded px-3 py-2 text-sm" value={editorData.difficulty} onChange={(e) => setEditorData({ ...editorData, difficulty: e.target.value })}>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Author</label>
                    <input className="w-full border border-slate-200 rounded px-3 py-2 text-sm" value={editorData.author} onChange={(e) => setEditorData({ ...editorData, author: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Read Time</label>
                    <input className="w-full border border-slate-200 rounded px-3 py-2 text-sm" value={editorData.read_time} onChange={(e) => setEditorData({ ...editorData, read_time: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="featured" type="checkbox" checked={!!editorData.featured} onChange={(e) => setEditorData({ ...editorData, featured: e.target.checked })} />
                    <label htmlFor="featured" className="text-sm text-slate-700">Featured</label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Tags (comma separated)</label>
                  <input className="w-full border border-slate-200 rounded px-3 py-2 text-sm" value={(editorData.tags || []).join(', ')} onChange={(e) => setEditorData({ ...editorData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
                </div>

                {/* WYSIWYG Toolbar */}
                <div className="flex items-center gap-2 border border-slate-200 rounded px-2 py-1 bg-slate-50">
                  <button className="px-2 py-1 text-sm" onClick={() => document.execCommand('bold')}>Bold</button>
                  <button className="px-2 py-1 text-sm" onClick={() => document.execCommand('italic')}>Italic</button>
                  <button className="px-2 py-1 text-sm" onClick={() => document.execCommand('underline')}>Underline</button>
                  <button className="px-2 py-1 text-sm" onClick={() => document.execCommand('insertUnorderedList')}>• List</button>
                  <button className="px-2 py-1 text-sm" onClick={() => document.execCommand('insertOrderedList')}>1. List</button>
                  <button className="px-2 py-1 text-sm" onClick={() => {
                    const url = prompt('Enter URL');
                    if (url) document.execCommand('createLink', false, url);
                  }}>Link</button>
                </div>
                <div className="border border-slate-200 rounded">
                  <div
                    ref={editorRef}
                    className="min-h-[220px] p-3 text-sm prose max-w-none"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={() => setEditorData({ ...editorData, content: editorRef.current?.innerHTML || '' })}
                    dangerouslySetInnerHTML={{ __html: editorData.content }}
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button className="px-3 py-1.5 border border-slate-200 rounded text-slate-700 text-sm" onClick={() => setIsEditorOpen(false)}>Cancel</button>
                  <button
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm"
                    onClick={async () => {
                      try {
                        if (!editorData.title || !editorData.category_id || !editorData.content) {
                          toast.warning('Title, Category, and Content are required');
                          return;
                        }
                        if (editorData.id) {
                          await updateKnowledgeArticle(editorData.id, {
                            title: editorData.title,
                            category_id: editorData.category_id,
                            author: editorData.author,
                            read_time: editorData.read_time,
                            difficulty: editorData.difficulty,
                            tags: editorData.tags,
                            content: editorData.content,
                            featured: editorData.featured,
                            last_updated: new Date().toISOString().slice(0, 10)
                          });
                        } else {
                          await createKnowledgeArticle({
                            title: editorData.title,
                            category_id: editorData.category_id,
                            author: editorData.author,
                            publish_date: new Date().toISOString().slice(0, 10),
                            last_updated: new Date().toISOString().slice(0, 10),
                            read_time: editorData.read_time,
                            difficulty: editorData.difficulty,
                            rating: 0,
                            views: 0,
                            tags: editorData.tags,
                            content: editorData.content,
                            featured: editorData.featured
                          } as any);
                        }
                        const arts = await fetchKnowledgeArticles();
                        setFetchedArticles(arts);
                        setIsEditorOpen(false);
                      } catch (e: unknown) {
                        logger.error('Failed to save article', e, 'Knowledge');
                        toast.error('Failed to save article');
                      }
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default KnowledgePage;
