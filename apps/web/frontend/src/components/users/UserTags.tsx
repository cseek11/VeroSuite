import { useState } from 'react';
import { X, Plus, Tag } from 'lucide-react';

interface UserTagsProps {
  tags: string[];
  onTagsChange?: (tags: string[]) => void;
  editable?: boolean;
  suggestedTags?: string[];
}

export default function UserTags({
  tags = [],
  onTagsChange,
  editable = false,
  suggestedTags = [],
}: UserTagsProps) {
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && onTagsChange) {
      onTagsChange([...tags, trimmedTag]);
      setNewTag('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (onTagsChange) {
      onTagsChange(tags.filter(tag => tag !== tagToRemove));
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!tags.includes(suggestion) && onTagsChange) {
      onTagsChange([...tags, suggestion]);
      setNewTag('');
      setShowSuggestions(false);
    }
  };

  const availableSuggestions = suggestedTags.filter(tag => !tags.includes(tag));

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Tag className="h-4 w-4 text-gray-400" />
        <h4 className="text-sm font-medium text-gray-700">Tags</h4>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
            >
              {tag}
              {editable && (
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {editable && (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => {
                setNewTag(e.target.value);
                setShowSuggestions(e.target.value.length > 0 && availableSuggestions.length > 0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                } else if (e.key === 'Escape') {
                  setShowSuggestions(false);
                }
              }}
              placeholder="Add tag..."
              className="flex-1 min-w-0 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
            <button
              onClick={handleAddTag}
              disabled={!newTag.trim()}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {showSuggestions && availableSuggestions.length > 0 && (
            <div className="border border-gray-200 rounded-md bg-white shadow-sm">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-200">
                Suggestions
              </div>
              <div className="p-2">
                {availableSuggestions
                  .filter(suggestion =>
                    suggestion.toLowerCase().includes(newTag.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center space-x-2"
                    >
                      <Tag className="h-3 w-3 text-gray-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tags.length === 0 && !editable && (
        <p className="text-sm text-gray-500">No tags assigned</p>
      )}
    </div>
  );
}





