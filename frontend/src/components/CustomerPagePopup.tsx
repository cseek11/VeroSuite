import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, User, Phone, Calendar, FileText, DollarSign, MessageSquare, Settings, BarChart3, MapPin, Mail, GripVertical, Maximize2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import CustomerOverviewPopup from './customer/CustomerOverviewPopup';
import CustomerContact from './customer/CustomerContact';
import CustomerServices from './customer/CustomerServices';
import CustomerFinancials from './customer/CustomerFinancials';
import CustomerCommunications from './customer/CustomerCommunications';
import CustomerDocuments from './customer/CustomerDocuments';
import CustomerAnalytics from './customer/CustomerAnalytics';
import CustomerSettings from './customer/CustomerSettings';
import CustomerNotesHistory from './customer/CustomerNotesHistory';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  state: string;
  zip_code?: string;
}

interface CustomerPagePopupProps {
  customerId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerPagePopup: React.FC<CustomerPagePopupProps> = ({
  customerId,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 720, height: 480 }); // Default size
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const popupRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Fetch customer data for header
  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => enhancedApi.customers.getById(customerId),
    enabled: !!customerId && isOpen
  });

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== headerRef.current && !headerRef.current?.contains(e.target as Node)) {
      return;
    }
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Allow popup to move freely without strict boundary constraints
      setPosition({
        x: newX,
        y: newY
      });
    }
    
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(400, Math.min(1200, resizeStart.width + deltaX));
      const newHeight = Math.max(400, Math.min(800, resizeStart.height + deltaY));
      
      setSize({ width: newWidth, height: newHeight });
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  // Handle expand to main content
  const handleExpand = () => {
    onClose(); // Close the popup
    navigate(`/customers/${customerId}`); // Navigate to the full customer page
  };

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, size.width, size.height]);

  // Reset position when popup opens
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
      setSize({ width: 720, height: 480 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'services', label: 'Services', icon: Calendar },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'communications', label: 'Messages', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notes', label: 'History', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const popupContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-[9999]"
      onClick={onClose}
    >
      {/* Draggable and Resizable Popup Container */}
      <div 
        ref={popupRef}
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
        style={{
          width: size.width,
          height: size.height,
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Draggable Header with Customer Information */}
        <div 
          ref={headerRef}
          className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <GripVertical className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center shadow-sm flex-shrink-0">
              <User className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-40"></div>
                </div>
              ) : customer ? (
                <>
                  <h2 className="text-sm font-semibold text-gray-900 truncate">{customer.name}</h2>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    {customer.address && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        <span className="truncate">
                          {customer.address}, {customer.city}, {customer.state} {customer.zip_code}
                        </span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-2.5 h-2.5" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Customer Not Found</h2>
                  <p className="text-xs text-gray-500">Unable to load customer information</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleExpand}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white/20 rounded transition-all duration-200 flex-shrink-0"
              title="Expand to full view"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white/20 rounded transition-all duration-200 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="px-4 py-2 bg-white border-b border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-9 w-full h-10 bg-gray-100 border border-gray-200 rounded-lg p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto overflow-x-hidden
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-gray-50
            [&::-webkit-scrollbar-thumb]:bg-purple-300
            hover:[&::-webkit-scrollbar-thumb]:bg-purple-400
            dark:[&::-webkit-scrollbar-track]:bg-gray-50
            dark:[&::-webkit-scrollbar-thumb]:bg-purple-300
            dark:hover:[&::-webkit-scrollbar-thumb]:bg-purple-400">
            <div className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                
                <TabsContent value="overview" className="mt-0">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <CustomerOverviewPopup customerId={customerId} />
                  </div>
                </TabsContent>
                
                <TabsContent value="contact" className="mt-0">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <CustomerContact customerId={customerId} />
                  </div>
                </TabsContent>
                
                <TabsContent value="services" className="mt-0">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <CustomerServices customerId={customerId} />
                  </div>
                </TabsContent>
                
                <TabsContent value="financials" className="mt-0">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <CustomerFinancials customerId={customerId} />
                  </div>
                </TabsContent>
                
                <TabsContent value="communications" className="mt-0">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <CustomerCommunications customerId={customerId} />
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="mt-0">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <CustomerDocuments customerId={customerId} />
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="mt-0">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <CustomerNotesHistory customerId={customerId} />
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-0">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <CustomerAnalytics customerId={customerId} />
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-0">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <CustomerSettings customerId={customerId} />
                  </div>
                </TabsContent>
                
              </Tabs>
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center"
          onMouseDown={handleResizeStart}
        >
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-b-[8px] border-b-gray-400"></div>
        </div>
      </div>
    </div>
  );

  // Render to document body using portal
  return createPortal(popupContent, document.body);
};

export default CustomerPagePopup;
