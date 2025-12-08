import React from 'react';
import { X } from 'lucide-react';
import { CardType } from '../types/dashboard.types';

interface CardSelectorProps {
  showCardSelector: boolean;
  setShowCardSelector: (show: boolean) => void;
  cardTypes: CardType[];
  handleAddCard: (type: string) => void;
}

export const CardSelector: React.FC<CardSelectorProps> = ({
  showCardSelector,
  setShowCardSelector,
  cardTypes,
  handleAddCard
}) => {
  if (!showCardSelector) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-50"
        onClick={() => setShowCardSelector(false)}
      />
      
      {/* Floating Dialog */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-w-[90vw] max-h-[90vh] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Add Card to Dashboard</h3>
            <button
              onClick={() => setShowCardSelector(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
            {cardTypes.map((cardType) => (
              <button
                key={cardType.id}
                onClick={() => {
                  handleAddCard(cardType.id);
                  setShowCardSelector(false);
                }}
                className="p-4 text-left bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <div className="font-medium text-gray-800 text-sm mb-1">{cardType.name}</div>
                <div className="text-xs text-gray-500">Click to add to dashboard</div>
              </button>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              ⌨️ Use 1-9 keys for quick card creation
            </p>
          </div>
        </div>
      </div>
    </>
  );
};











