import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Heading,
  Text,
} from '@/components/ui';
import {
  Camera,
  MapPin,
  Calendar,
  User,
  Download,
  Share2,
  Grid,
  List,
  Filter,
  Plus
} from 'lucide-react';

interface CustomerPhoto {
  id: string;
  photo_type: string;
  photo_category: string;
  file_url: string;
  thumbnail_url?: string;
  file_size?: number;
  taken_by?: string;
  taken_at: string;
  work_order_id?: string;
  location_coords?: string;
  description?: string;
  is_before_photo: boolean;
  is_customer_facing: boolean;
  pest_type?: string;
  treatment_area?: string;
}

interface PhotoGalleryProps {
  photos: CustomerPhoto[];
  customerId: string;
  isLoading: boolean;
}

export default function PhotoGallery({ photos, customerId: _customerId, isLoading }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<CustomerPhoto | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const getPhotoTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'property': return 'bg-blue-100 text-blue-800';
      case 'before_service': return 'bg-red-100 text-red-800';
      case 'after_service': return 'bg-green-100 text-green-800';
      case 'damage': return 'bg-orange-100 text-orange-800';
      case 'pest_evidence': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhotoCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'profile': return 'bg-blue-100 text-blue-800';
      case 'work_order': return 'bg-green-100 text-green-800';
      case 'inspection': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredPhotos = photos.filter(photo => {
    if (selectedCategory !== 'all' && photo.photo_category !== selectedCategory) return false;
    if (selectedType !== 'all' && photo.photo_type !== selectedType) return false;
    return true;
  });

  const categories = ['all', ...Array.from(new Set(photos.map(p => p.photo_category)))];
  const types = ['all', ...Array.from(new Set(photos.map(p => p.photo_type)))];

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Text variant="body" className="text-slate-600">
            Loading photos...
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Heading level={3} className="text-slate-900">
            Photo Gallery
          </Heading>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Button
              variant="primary"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Upload Photo
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <Text variant="small" className="text-slate-600">Category:</Text>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-1 border border-slate-300 rounded text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Text variant="small" className="text-slate-600">Type:</Text>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-1 border border-slate-300 rounded text-sm"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Photo Grid/List */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <Heading level={4} className="text-slate-900 mb-2">
              No Photos Found
            </Heading>
            <Text variant="body" className="text-slate-600">
              No photos match the selected filters.
            </Text>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
            : 'space-y-4'
          }>
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className={`border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                  viewMode === 'list' ? 'flex gap-4 p-4' : ''
                }`}
                onClick={() => {
                  setSelectedPhoto(photo);
                  setShowPhotoModal(true);
                }}
              >
                {/* Photo Thumbnail */}
                <div className={`relative ${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square'}`}>
                  <img
                    src={photo.thumbnail_url || photo.file_url}
                    alt={photo.description || 'Customer photo'}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Photo Type Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="default"
                      className={getPhotoTypeColor(photo.photo_type)}
                    >
                      {photo.photo_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  {/* Before/After Indicator */}
                  {photo.is_before_photo && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Before
                    </div>
                  )}
                </div>

                {/* Photo Details */}
                <div className={`${viewMode === 'list' ? 'flex-1' : 'p-3'}`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="default"
                        className={getPhotoCategoryColor(photo.photo_category)}
                      >
                        {photo.photo_category}
                      </Badge>
                      {photo.pest_type && (
                        <Badge variant="default" className="bg-purple-100 text-purple-800">
                          {photo.pest_type}
                        </Badge>
                      )}
                    </div>
                    
                    {photo.description && (
                      <Text variant="small" className="text-slate-700 line-clamp-2">
                        {photo.description}
                      </Text>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(photo.taken_at)}</span>
                    </div>
                    
                    {photo.taken_by && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <User className="h-3 w-3" />
                        <span>{photo.taken_by}</span>
                      </div>
                    )}
                    
                    {photo.location_coords && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-3 w-3" />
                        <span>GPS</span>
                      </div>
                    )}
                    
                    {photo.file_size && (
                      <div className="text-sm text-slate-500">
                        {formatFileSize(photo.file_size)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Photo Statistics */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Heading level={4} className="text-blue-900 font-semibold">
              {photos.length}
            </Heading>
            <Text variant="small" className="text-blue-600">
              Total Photos
            </Text>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Heading level={4} className="text-green-900 font-semibold">
              {photos.filter(p => p.photo_type === 'before_service').length}
            </Heading>
            <Text variant="small" className="text-green-600">
              Before Photos
            </Text>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <Heading level={4} className="text-purple-900 font-semibold">
              {photos.filter(p => p.photo_type === 'pest_evidence').length}
            </Heading>
            <Text variant="small" className="text-purple-600">
              Pest Evidence
            </Text>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <Heading level={4} className="text-orange-900 font-semibold">
              {photos.filter(p => p.location_coords).length}
            </Heading>
            <Text variant="small" className="text-orange-600">
              GPS Tagged
            </Text>
          </div>
        </div>
      </Card>

      {/* Photo Detail Modal */}
      <Dialog open={showPhotoModal} onOpenChange={(open) => !open && setShowPhotoModal(false)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Photo Details</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-6">
              {/* Photo Display */}
              <div className="relative">
                <img
                  src={selectedPhoto.file_url}
                  alt={selectedPhoto.description || 'Customer photo'}
                  className="w-full h-96 object-cover rounded-lg"
                />
                
                {/* Photo Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge
                    variant="default"
                    className={getPhotoTypeColor(selectedPhoto.photo_type)}
                  >
                    {selectedPhoto.photo_type.replace('_', ' ')}
                  </Badge>
                  <Badge
                    variant="default"
                    className={getPhotoCategoryColor(selectedPhoto.photo_category)}
                  >
                    {selectedPhoto.photo_category}
                  </Badge>
                  {selectedPhoto.is_before_photo && (
                    <Badge variant="default" className="bg-red-100 text-red-800">
                      Before
                    </Badge>
                  )}
                </div>
              </div>

              {/* Photo Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text variant="small" className="text-slate-600">Taken At</Text>
                  <Text variant="body">{formatDate(selectedPhoto.taken_at)}</Text>
                </div>
                
                {selectedPhoto.taken_by && (
                  <div>
                    <Text variant="small" className="text-slate-600">Taken By</Text>
                    <Text variant="body">{selectedPhoto.taken_by}</Text>
                  </div>
                )}
                
                {selectedPhoto.location_coords && (
                  <div>
                    <Text variant="small" className="text-slate-600">GPS Coordinates</Text>
                    <Text variant="body">{selectedPhoto.location_coords}</Text>
                  </div>
                )}
                
                {selectedPhoto.treatment_area && (
                  <div>
                    <Text variant="small" className="text-slate-600">Treatment Area</Text>
                    <Text variant="body">{selectedPhoto.treatment_area}</Text>
                  </div>
                )}
                
                {selectedPhoto.pest_type && (
                  <div>
                    <Text variant="small" className="text-slate-600">Pest Type</Text>
                    <Text variant="body">{selectedPhoto.pest_type}</Text>
                  </div>
                )}
                
                {selectedPhoto.file_size && (
                  <div>
                    <Text variant="small" className="text-slate-600">File Size</Text>
                    <Text variant="body">{formatFileSize(selectedPhoto.file_size)}</Text>
                  </div>
                )}
              </div>

              {selectedPhoto.description && (
                <div>
                  <Text variant="small" className="text-slate-600 mb-2">Description</Text>
                  <Text variant="body">{selectedPhoto.description}</Text>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPhotoModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}







