import React, { useState } from 'react';
import {
  Card,
  Button,
  Typography,
  Chip,
  Modal
} from '@/components/ui/EnhancedUI';
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

export default function PhotoGallery({ photos, customerId, isLoading }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<CustomerPhoto | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const getPhotoTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'property': return 'blue';
      case 'before_service': return 'red';
      case 'after_service': return 'green';
      case 'damage': return 'orange';
      case 'pest_evidence': return 'purple';
      default: return 'gray';
    }
  };

  const getPhotoCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'profile': return 'blue';
      case 'work_order': return 'green';
      case 'inspection': return 'yellow';
      case 'maintenance': return 'purple';
      default: return 'gray';
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
          <Typography variant="body1" className="text-gray-600">
            Loading photos...
          </Typography>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h3" className="text-gray-900">
            Photo Gallery
          </Typography>
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
            <Filter className="h-4 w-4 text-gray-500" />
            <Typography variant="body2" className="text-gray-600">Category:</Typography>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-1 border border-gray-300 rounded text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Typography variant="body2" className="text-gray-600">Type:</Typography>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-1 border border-gray-300 rounded text-sm"
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
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Typography variant="h4" className="text-gray-900 mb-2">
              No Photos Found
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              No photos match the selected filters.
            </Typography>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
            : 'space-y-4'
          }>
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
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
                    <Chip
                      color={getPhotoTypeColor(photo.photo_type)}
                      variant="default"
                      size="sm"
                    >
                      {photo.photo_type.replace('_', ' ')}
                    </Chip>
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
                      <Chip
                        color={getPhotoCategoryColor(photo.photo_category)}
                        variant="default"
                        size="sm"
                      >
                        {photo.photo_category}
                      </Chip>
                      {photo.pest_type && (
                        <Chip color="purple" variant="default" size="sm">
                          {photo.pest_type}
                        </Chip>
                      )}
                    </div>
                    
                    {photo.description && (
                      <Typography variant="body2" className="text-gray-700 line-clamp-2">
                        {photo.description}
                      </Typography>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(photo.taken_at)}</span>
                    </div>
                    
                    {photo.taken_by && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-3 w-3" />
                        <span>{photo.taken_by}</span>
                      </div>
                    )}
                    
                    {photo.location_coords && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>GPS</span>
                      </div>
                    )}
                    
                    {photo.file_size && (
                      <div className="text-sm text-gray-500">
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
            <Typography variant="h4" className="text-blue-900 font-semibold">
              {photos.length}
            </Typography>
            <Typography variant="body2" className="text-blue-600">
              Total Photos
            </Typography>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Typography variant="h4" className="text-green-900 font-semibold">
              {photos.filter(p => p.photo_type === 'before_service').length}
            </Typography>
            <Typography variant="body2" className="text-green-600">
              Before Photos
            </Typography>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <Typography variant="h4" className="text-purple-900 font-semibold">
              {photos.filter(p => p.photo_type === 'pest_evidence').length}
            </Typography>
            <Typography variant="body2" className="text-purple-600">
              Pest Evidence
            </Typography>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <Typography variant="h4" className="text-orange-900 font-semibold">
              {photos.filter(p => p.location_coords).length}
            </Typography>
            <Typography variant="body2" className="text-orange-600">
              GPS Tagged
            </Typography>
          </div>
        </div>
      </Card>

      {/* Photo Detail Modal */}
      <Modal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        title="Photo Details"
        size="xl"
      >
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
                <Chip
                  color={getPhotoTypeColor(selectedPhoto.photo_type)}
                  variant="default"
                >
                  {selectedPhoto.photo_type.replace('_', ' ')}
                </Chip>
                <Chip
                  color={getPhotoCategoryColor(selectedPhoto.photo_category)}
                  variant="default"
                >
                  {selectedPhoto.photo_category}
                </Chip>
                {selectedPhoto.is_before_photo && (
                  <Chip color="red" variant="default">
                    Before
                  </Chip>
                )}
              </div>
            </div>

            {/* Photo Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="body2" className="text-gray-600">Taken At</Typography>
                <Typography variant="body1">{formatDate(selectedPhoto.taken_at)}</Typography>
              </div>
              
              {selectedPhoto.taken_by && (
                <div>
                  <Typography variant="body2" className="text-gray-600">Taken By</Typography>
                  <Typography variant="body1">{selectedPhoto.taken_by}</Typography>
                </div>
              )}
              
              {selectedPhoto.location_coords && (
                <div>
                  <Typography variant="body2" className="text-gray-600">GPS Coordinates</Typography>
                  <Typography variant="body1">{selectedPhoto.location_coords}</Typography>
                </div>
              )}
              
              {selectedPhoto.treatment_area && (
                <div>
                  <Typography variant="body2" className="text-gray-600">Treatment Area</Typography>
                  <Typography variant="body1">{selectedPhoto.treatment_area}</Typography>
                </div>
              )}
              
              {selectedPhoto.pest_type && (
                <div>
                  <Typography variant="body2" className="text-gray-600">Pest Type</Typography>
                  <Typography variant="body1">{selectedPhoto.pest_type}</Typography>
                </div>
              )}
              
              {selectedPhoto.file_size && (
                <div>
                  <Typography variant="body2" className="text-gray-600">File Size</Typography>
                  <Typography variant="body1">{formatFileSize(selectedPhoto.file_size)}</Typography>
                </div>
              )}
            </div>

            {selectedPhoto.description && (
              <div>
                <Typography variant="body2" className="text-gray-600 mb-2">Description</Typography>
                <Typography variant="body1">{selectedPhoto.description}</Typography>
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
      </Modal>
    </>
  );
}






