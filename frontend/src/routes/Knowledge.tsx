import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Filter,
  Tag,
  Calendar,
  User,
  Star,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  FileText,
  Video,
  Image,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  FolderOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

// Mock data for knowledge base
const mockCategories = [
  {
    id: 'pest-identification',
    name: 'Pest Identification',
    description: 'Learn to identify common pests and their characteristics',
    articleCount: 24,
    icon: '🐜'
  },
  {
    id: 'treatment-methods',
    name: 'Treatment Methods',
    description: 'Effective treatment and control methods for various pests',
    articleCount: 18,
    icon: '🧪'
  },
  {
    id: 'safety-protocols',
    name: 'Safety Protocols',
    description: 'Safety guidelines and best practices for pest control',
    articleCount: 12,
    icon: '🛡️'
  },
  {
    id: 'equipment-guides',
    name: 'Equipment Guides',
    description: 'How to use and maintain pest control equipment',
    articleCount: 15,
    icon: '🔧'
  },
  {
    id: 'regulations',
    name: 'Regulations & Compliance',
    description: 'Industry regulations and compliance requirements',
    articleCount: 8,
    icon: '📋'
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    description: 'Best practices for customer interactions and service',
    articleCount: 10,
    icon: '👥'
  }
];

const mockArticles = [
  {
    id: 'art-001',
    title: 'How to Identify Common Household Ants',
    category: 'pest-identification',
    author: 'Dr. Sarah Johnson',
    publishDate: '2024-01-15',
    lastUpdated: '2024-01-20',
    readTime: '5 min',
    difficulty: 'beginner',
    rating: 4.8,
    views: 1247,
    tags: ['ants', 'identification', 'household'],
    content: 'Learn to identify the most common ant species found in households...',
    featured: true
  },
  {
    id: 'art-002',
    title: 'Safe Chemical Application Techniques',
    category: 'safety-protocols',
    author: 'Mike Chen',
    publishDate: '2024-01-10',
    lastUpdated: '2024-01-18',
    readTime: '8 min',
    difficulty: 'intermediate',
    rating: 4.6,
    views: 892,
    tags: ['safety', 'chemicals', 'application'],
    content: 'Essential safety protocols for chemical application in pest control...',
    featured: false
  },
  {
    id: 'art-003',
    title: 'Integrated Pest Management (IPM) Strategies',
    category: 'treatment-methods',
    author: 'Dr. Emily Rodriguez',
    publishDate: '2024-01-08',
    lastUpdated: '2024-01-15',
    readTime: '12 min',
    difficulty: 'advanced',
    rating: 4.9,
    views: 1563,
    tags: ['IPM', 'strategies', 'management'],
    content: 'Comprehensive guide to implementing IPM strategies...',
    featured: true
  },
  {
    id: 'art-004',
    title: 'Equipment Maintenance Checklist',
    category: 'equipment-guides',
    author: 'Tom Wilson',
    publishDate: '2024-01-05',
    lastUpdated: '2024-01-12',
    readTime: '6 min',
    difficulty: 'intermediate',
    rating: 4.4,
    views: 734,
    tags: ['equipment', 'maintenance', 'checklist'],
    content: 'Regular maintenance checklist for pest control equipment...',
    featured: false
  },
  {
    id: 'art-005',
    title: 'Customer Communication Best Practices',
    category: 'customer-service',
    author: 'Lisa Thompson',
    publishDate: '2024-01-03',
    lastUpdated: '2024-01-10',
    readTime: '7 min',
    difficulty: 'beginner',
    rating: 4.7,
    views: 1102,
    tags: ['communication', 'customer-service', 'best-practices'],
    content: 'Effective communication strategies for customer interactions...',
    featured: false
  }
];

const mockFaqs = [
  {
    id: 'faq-001',
    question: 'What should I do if I find termites in my home?',
    answer: 'Immediately contact a licensed pest control professional. Do not attempt to treat termites yourself as they require specialized treatment methods.',
    category: 'emergency',
    helpful: 156,
    notHelpful: 3
  },
  {
    id: 'faq-002',
    question: 'How often should I schedule pest control services?',
    answer: 'Most homes benefit from quarterly pest control services, but frequency depends on your location, pest pressure, and specific needs.',
    category: 'general',
    helpful: 89,
    notHelpful: 2
  },
  {
    id: 'faq-003',
    question: 'Are the chemicals used in pest control safe for pets?',
    answer: 'Modern pest control products are designed to be safe when applied correctly. Always follow label instructions and keep pets away during application.',
    category: 'safety',
    helpful: 203,
    notHelpful: 5
  }
];

const KnowledgePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const tabs = [
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'favorites', label: 'Favorites', icon: Bookmark }
  ];

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

  const filteredArticles = mockArticles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || article.category === selectedCategory)
  );

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
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm">
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
            {mockCategories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
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
              {filteredArticles.map((article) => (
                <div key={article.id} className="p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
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
                    <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                      {article.content}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-3">
                      <span>{article.readTime}</span>
                      <span>{article.views} views</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span>{article.rating}</span>
                      </div>
                    </div>
                    {getDifficultyIcon(article.difficulty)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-600">{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="h-6 px-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded hover:bg-white hover:shadow-lg transition-all duration-200">
                        <Bookmark className="h-3 w-3" />
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

          {activeTab === 'categories' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-emerald-100 rounded-md">
                  <FolderOpen className="h-4 w-4 text-emerald-600" />
                </div>
                Categories
              </h2>
              <div className="space-y-3">
                {mockCategories.map((category) => {
                  const isExpanded = expandedCategories.includes(category.id);
                  const categoryArticles = getCategoryArticles(category.id);
                  
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
                <div className="prose max-w-none">
                  <p className="text-slate-700">
                    {selectedArticle.content}
                  </p>
                </div>
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
    </div>
  );
};

export default KnowledgePage;
