import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Input, 
  Dropdown
} from '@/components/ui/EnhancedUI';
import Select from '@/components/ui/Select';
import { Badge } from '@/components/ui/CRMComponents';
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
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" className="text-2xl font-bold text-gray-900 mb-1">
              Knowledge Base
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Access pest control guides, safety protocols, and best practices
            </Typography>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Article
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-blue-600 mb-1">Total Articles</Typography>
              <Typography variant="h3" className="text-blue-900">{mockArticles.length}</Typography>
              <div className="flex items-center gap-1 mt-1">
                <FileText className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-600">Knowledge base</span>
              </div>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-green-600 mb-1">Categories</Typography>
              <Typography variant="h3" className="text-green-900">{mockCategories.length}</Typography>
              <div className="flex items-center gap-1 mt-1">
                <FolderOpen className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">Organized topics</span>
              </div>
            </div>
            <FolderOpen className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-purple-600 mb-1">Total Views</Typography>
              <Typography variant="h3" className="text-purple-900">
                {mockArticles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}
              </Typography>
              <div className="flex items-center gap-1 mt-1">
                <Eye className="h-3 w-3 text-purple-600" />
                <span className="text-xs text-purple-600">Knowledge accessed</span>
              </div>
            </div>
            <Eye className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-orange-600 mb-1">Avg Rating</Typography>
              <Typography variant="h3" className="text-orange-900">
                {(mockArticles.reduce((sum, article) => sum + article.rating, 0) / mockArticles.length).toFixed(1)}
              </Typography>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 text-orange-600" />
                <span className="text-xs text-orange-600">User satisfaction</span>
              </div>
            </div>
            <Star className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles, FAQs, or categories..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid transparent',
              backgroundClip: 'padding-box',
              position: 'relative',
              borderRadius: '0.5rem',
              color: 'rgb(30, 41, 59)',
              backdropFilter: 'blur(4px)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <option value="all">All Categories</option>
            {mockCategories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 overflow-hidden">
        <div className="flex space-x-4 overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 py-1 px-1 border-b-2 font-medium text-xs whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="p-4 hover:shadow-lg transition-shadow border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(article.difficulty)}`}>
                          {article.difficulty}
                        </span>
                        {article.featured && (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <Dropdown
                        trigger={
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                        items={[
                          { label: 'View', onClick: () => setSelectedArticle(article) },
                          { label: 'Edit', onClick: () => {} },
                          { label: 'Share', onClick: () => {} },
                          { label: 'Delete', onClick: () => {} }
                        ]}
                      />
                    </div>
                    <div className="mb-3">
                      <Typography variant="h6" className="text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mb-2 line-clamp-2">
                        {article.content}
                      </Typography>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-4">
                        <span>{article.readTime}</span>
                        <span>{article.views} views</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{article.rating}</span>
                        </div>
                      </div>
                      {getDifficultyIcon(article.difficulty)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="h-6 px-2">
                          <Bookmark className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-6 px-2">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-4">
                {mockCategories.map((category) => {
                  const isExpanded = expandedCategories.includes(category.id);
                  const categoryArticles = getCategoryArticles(category.id);
                  
                  return (
                    <div key={category.id} className="border border-gray-200 rounded-lg">
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{category.icon}</span>
                            <div>
                              <Typography variant="h6" className="text-gray-900">
                                {category.name}
                              </Typography>
                              <Typography variant="body2" className="text-gray-600">
                                {category.description}
                              </Typography>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="neutral" className="text-xs">
                              {category.articleCount} articles
                            </Badge>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {categoryArticles.map((article) => (
                              <div key={article.id} className="p-3 bg-white rounded border border-gray-200">
                                <Typography variant="h6" className="text-gray-900 mb-1 text-sm">
                                  {article.title}
                                </Typography>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>{article.readTime}</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500" />
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
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-gray-600" />
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          faq.category === 'emergency' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {faq.category}
                        </span>
                      </div>
                      <Dropdown
                        trigger={
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                        items={[
                          { label: 'Edit', onClick: () => {} },
                          { label: 'Share', onClick: () => {} },
                          { label: 'Delete', onClick: () => {} }
                        ]}
                      />
                    </div>
                    <div className="mb-3">
                      <Typography variant="h6" className="text-gray-900 mb-2">
                        {faq.question}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {faq.answer}
                      </Typography>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-green-500" />
                          <span>{faq.helpful} helpful</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsDown className="h-3 w-3 text-red-500" />
                          <span>{faq.notHelpful} not helpful</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-6 px-2">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-6 px-2">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Typography variant="h6" className="text-gray-900 mb-2">
                  No Favorites Yet
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-4">
                  Start bookmarking articles and FAQs to access them quickly
                </Typography>
                <Button variant="primary" onClick={() => setActiveTab('articles')}>
                  Browse Articles
                </Button>
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
                <Typography variant="h2" className="text-xl font-bold text-gray-900">
                  {selectedArticle.title}
                </Typography>
                <Button variant="outline" onClick={() => setSelectedArticle(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>By {selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                  <span>•</span>
                  <span>{selectedArticle.views} views</span>
                </div>
                <div className="prose max-w-none">
                  <Typography variant="body1" className="text-gray-700">
                    {selectedArticle.content}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  {selectedArticle.tags.map((tag: string) => (
                    <Badge key={tag} variant="neutral" className="text-xs">
                      {tag}
                    </Badge>
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
