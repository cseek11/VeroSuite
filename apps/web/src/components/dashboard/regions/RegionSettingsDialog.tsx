import React, { useState, useEffect, useMemo } from 'react';
import { Settings, Palette, Zap, Code, RotateCcw, Eye } from 'lucide-react';
import { DashboardRegion, RegionType } from '@/routes/dashboard/types/region.types';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/CRMComponents';
import { Label } from '@/components/ui/Label';
import Input from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import Button from '@/components/ui/Button';

interface RegionSettingsDialogProps {
  region: DashboardRegion;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<DashboardRegion>) => Promise<void>;
}

export const RegionSettingsDialog: React.FC<RegionSettingsDialogProps> = ({
  region,
  isOpen,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'behavior' | 'advanced'>('general');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // General settings
  const [regionType, setRegionType] = useState<RegionType>(region.region_type);
  const [title, setTitle] = useState<string>(
    region.config?.title || region.region_type.replace('-', ' ')
  );
  const [description, setDescription] = useState<string>(
    region.config?.description || ''
  );

  // Appearance settings
  const defaultColors = {
    backgroundColor: 'rgb(255,255,255)',
    headerColor: 'rgb(249,250,251)',
    borderColor: 'rgb(229,231,235)'
  };

  const [backgroundColor, setBackgroundColor] = useState<string>(
    region.config?.backgroundColor || defaultColors.backgroundColor
  );
  const [headerColor, setHeaderColor] = useState<string>(
    region.config?.headerColor || defaultColors.headerColor
  );
  const [borderColor, setBorderColor] = useState<string>(
    region.config?.borderColor || defaultColors.borderColor
  );
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(
    region.config?.fontSize || 'medium'
  );
  const [padding, setPadding] = useState<number>(
    region.config?.padding ?? 16
  );
  const [borderRadius, setBorderRadius] = useState<number>(
    region.config?.borderRadius ?? 8
  );
  const [shadowDepth, setShadowDepth] = useState<number>(
    region.config?.shadowDepth ?? 1
  );

  // Behavior settings
  const [isLocked, setIsLocked] = useState<boolean>(region.is_locked || false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(region.is_collapsed || false);
  const [isHiddenMobile, setIsHiddenMobile] = useState<boolean>(region.is_hidden_mobile || false);
  const [enableAnimations, setEnableAnimations] = useState<boolean>(
    region.config?.enableAnimations ?? true
  );
  const [enableHoverEffects, setEnableHoverEffects] = useState<boolean>(
    region.config?.enableHoverEffects ?? true
  );

  // Helper to convert RGB to hex for color picker
  const rgbToHex = (rgb: string): string => {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match && match[1] && match[2] && match[3]) {
      const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
      const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
      const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
    if (rgb.startsWith('#')) return rgb;
    return '#ffffff';
  };

  // Reset all settings to defaults
  const handleReset = () => {
    setBackgroundColor(defaultColors.backgroundColor);
    setHeaderColor(defaultColors.headerColor);
    setBorderColor(defaultColors.borderColor);
    setFontSize('medium');
    setPadding(16);
    setBorderRadius(8);
    setShadowDepth(1);
    setEnableAnimations(true);
    setEnableHoverEffects(true);
    setHasChanges(true);
  };

  // Initialize state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setRegionType(region.region_type);
      const bgColor = region.config?.backgroundColor || defaultColors.backgroundColor;
      const hdrColor = region.config?.headerColor || defaultColors.headerColor;
      const brdColor = region.config?.borderColor || defaultColors.borderColor;
      setBackgroundColor(bgColor);
      setHeaderColor(hdrColor);
      setBorderColor(brdColor);
      setTitle(region.config?.title || region.region_type.replace('-', ' '));
      setDescription(region.config?.description || '');
      setFontSize(region.config?.fontSize || 'medium');
      setPadding(region.config?.padding ?? 16);
      setBorderRadius(region.config?.borderRadius ?? 8);
      setShadowDepth(region.config?.shadowDepth ?? 1);
      setIsLocked(region.is_locked || false);
      setIsCollapsed(region.is_collapsed || false);
      setIsHiddenMobile(region.is_hidden_mobile || false);
      setEnableAnimations(region.config?.enableAnimations ?? true);
      setEnableHoverEffects(region.config?.enableHoverEffects ?? true);
      setHasChanges(false);
      setActiveTab('general');
    }
  }, [isOpen, region]);

  // Track changes
  useEffect(() => {
    const hasGeneralChanges = 
      regionType !== region.region_type ||
      title !== (region.config?.title || region.region_type.replace('-', ' ')) ||
      description !== (region.config?.description || '');
    
    const hasAppearanceChanges =
      backgroundColor !== (region.config?.backgroundColor || defaultColors.backgroundColor) ||
      headerColor !== (region.config?.headerColor || defaultColors.headerColor) ||
      borderColor !== (region.config?.borderColor || defaultColors.borderColor) ||
      fontSize !== (region.config?.fontSize || 'medium') ||
      padding !== (region.config?.padding ?? 16) ||
      borderRadius !== (region.config?.borderRadius ?? 8) ||
      shadowDepth !== (region.config?.shadowDepth ?? 1);

    const hasBehaviorChanges =
      isLocked !== (region.is_locked || false) ||
      isCollapsed !== (region.is_collapsed || false) ||
      isHiddenMobile !== (region.is_hidden_mobile || false) ||
      enableAnimations !== (region.config?.enableAnimations ?? true) ||
      enableHoverEffects !== (region.config?.enableHoverEffects ?? true);

    setHasChanges(hasGeneralChanges || hasAppearanceChanges || hasBehaviorChanges);
  }, [
    regionType, title, description,
    backgroundColor, headerColor, borderColor, fontSize, padding, borderRadius, shadowDepth,
    isLocked, isCollapsed, isHiddenMobile, enableAnimations, enableHoverEffects,
    region
  ]);

  // Live preview region
  const previewRegion = useMemo(() => ({
    ...region,
    region_type: regionType,
    is_locked: isLocked,
    is_collapsed: isCollapsed,
    is_hidden_mobile: isHiddenMobile,
    config: {
      ...region.config,
      title,
      description,
      backgroundColor,
      headerColor,
      borderColor,
      fontSize,
      padding,
      borderRadius,
      shadowDepth,
      enableAnimations,
      enableHoverEffects
    }
  }), [
    region, regionType, title, description,
    backgroundColor, headerColor, borderColor, fontSize, padding, borderRadius, shadowDepth,
    isLocked, isCollapsed, isHiddenMobile, enableAnimations, enableHoverEffects
  ]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { normalizeColor } = await import('@/lib/sanitization');
      
      await onSave({
        region_type: regionType,
        is_locked: isLocked,
        is_collapsed: isCollapsed,
        is_hidden_mobile: isHiddenMobile,
        config: {
          ...region.config,
          title,
          description,
          backgroundColor: normalizeColor(backgroundColor) || backgroundColor,
          headerColor: normalizeColor(headerColor) || headerColor,
          borderColor: normalizeColor(borderColor) || borderColor,
          fontSize,
          padding,
          borderRadius,
          shadowDepth,
          enableAnimations,
          enableHoverEffects
        }
      });
      setHasChanges(false);
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save region settings';
      logger.error('Failed to save region settings', { error, regionId: region.id }, 'RegionSettingsDialog');
      toast.error(`Failed to save region settings: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const fontSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const shadowClasses = {
    0: 'shadow-none',
    1: 'shadow-sm',
    2: 'shadow',
    3: 'shadow-md',
    4: 'shadow-lg',
    5: 'shadow-xl'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Region Settings
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-4 min-h-0">
          {/* Settings Panel */}
          <div className="flex-1 overflow-y-auto pr-2">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="behavior" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Behavior</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  <span className="hidden sm:inline">Advanced</span>
                </TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-4">
                <div>
                  <Label htmlFor="region-type">Region Type</Label>
                  <select
                    id="region-type"
                    value={regionType}
                    onChange={(e) => setRegionType(e.target.value as RegionType)}
                    className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {Object.values(RegionType).map(type => (
                      <option key={type} value={type}>
                        {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 100) {
                        setTitle(value);
                      }
                    }}
                    maxLength={100}
                    placeholder="Region title"
                    className="mt-1"
                  />
                  {title.length > 80 && (
                    <p className="text-xs text-gray-500 mt-1">{100 - title.length} characters remaining</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 500) {
                        setDescription(value);
                      }
                    }}
                    maxLength={500}
                    rows={3}
                    placeholder="Optional description"
                    className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  {description.length > 450 && (
                    <p className="text-xs text-gray-500 mt-1">{500 - description.length} characters remaining</p>
                  )}
                </div>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="color"
                        value={rgbToHex(backgroundColor)}
                        onChange={(e) => {
                          const hex = e.target.value;
                          const r = parseInt(hex.slice(1, 3), 16);
                          const g = parseInt(hex.slice(3, 5), 16);
                          const b = parseInt(hex.slice(5, 7), 16);
                          setBackgroundColor(`rgb(${r},${g},${b})`);
                        }}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="rgb(255,255,255)"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Header Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="color"
                        value={rgbToHex(headerColor)}
                        onChange={(e) => {
                          const hex = e.target.value;
                          const r = parseInt(hex.slice(1, 3), 16);
                          const g = parseInt(hex.slice(3, 5), 16);
                          const b = parseInt(hex.slice(5, 7), 16);
                          setHeaderColor(`rgb(${r},${g},${b})`);
                        }}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={headerColor}
                        onChange={(e) => setHeaderColor(e.target.value)}
                        placeholder="rgb(249,250,251)"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Border Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="color"
                        value={rgbToHex(borderColor)}
                        onChange={(e) => {
                          const hex = e.target.value;
                          const r = parseInt(hex.slice(1, 3), 16);
                          const g = parseInt(hex.slice(3, 5), 16);
                          const b = parseInt(hex.slice(5, 7), 16);
                          setBorderColor(`rgb(${r},${g},${b})`);
                        }}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        placeholder="rgb(229,231,235)"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="font-size">Font Size</Label>
                    <select
                      id="font-size"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
                      className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="padding">Padding (px)</Label>
                    <Input
                      id="padding"
                      type="number"
                      min="0"
                      max="48"
                      value={padding}
                      onChange={(e) => setPadding(Math.max(0, Math.min(48, parseInt(e.target.value) || 0)))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="border-radius">Border Radius (px)</Label>
                    <Input
                      id="border-radius"
                      type="number"
                      min="0"
                      max="24"
                      value={borderRadius}
                      onChange={(e) => setBorderRadius(Math.max(0, Math.min(24, parseInt(e.target.value) || 0)))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shadow">Shadow Depth</Label>
                    <select
                      id="shadow"
                      value={shadowDepth}
                      onChange={(e) => setShadowDepth(parseInt(e.target.value))}
                      className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {[0, 1, 2, 3, 4, 5].map(depth => (
                        <option key={depth} value={depth}>
                          {depth === 0 ? 'None' : `Level ${depth}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Defaults
                  </Button>
                </div>
              </TabsContent>

              {/* Behavior Tab */}
              <TabsContent value="behavior" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lock">Lock Region</Label>
                      <p className="text-xs text-gray-500 mt-0.5">Prevent dragging and resizing</p>
                    </div>
                    <Switch
                      id="lock"
                      checked={isLocked}
                      onCheckedChange={setIsLocked}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="collapse">Collapsed</Label>
                      <p className="text-xs text-gray-500 mt-0.5">Start in collapsed state</p>
                    </div>
                    <Switch
                      id="collapse"
                      checked={isCollapsed}
                      onCheckedChange={setIsCollapsed}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="hide-mobile">Hide on Mobile</Label>
                      <p className="text-xs text-gray-500 mt-0.5">Hide this region on mobile devices</p>
                    </div>
                    <Switch
                      id="hide-mobile"
                      checked={isHiddenMobile}
                      onCheckedChange={setIsHiddenMobile}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="animations">Enable Animations</Label>
                      <p className="text-xs text-gray-500 mt-0.5">Enable transition animations</p>
                    </div>
                    <Switch
                      id="animations"
                      checked={enableAnimations}
                      onCheckedChange={setEnableAnimations}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="hover-effects">Enable Hover Effects</Label>
                      <p className="text-xs text-gray-500 mt-0.5">Enable hover state effects</p>
                    </div>
                    <Switch
                      id="hover-effects"
                      checked={enableHoverEffects}
                      onCheckedChange={setEnableHoverEffects}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-4">
                <div>
                  <Label>Widget Configuration</Label>
                  <p className="text-xs text-gray-500 mt-1 mb-2">
                    Advanced widget settings (JSON format)
                  </p>
                  <textarea
                    value={JSON.stringify(region.widget_config || {}, null, 2)}
                    readOnly
                    rows={8}
                    className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-md bg-gray-50 resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Widget configuration is managed by the widget itself
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview Panel */}
          <div className="w-80 flex-shrink-0 border-l border-gray-200 pl-4 overflow-y-auto">
            <div className="sticky top-0 bg-white pb-2 mb-4 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Eye className="w-4 h-4" />
                Live Preview
              </div>
            </div>
            <div
              className="border rounded-lg overflow-hidden"
              style={{
                backgroundColor: previewRegion.config.backgroundColor,
                borderColor: previewRegion.config.borderColor,
                borderRadius: `${previewRegion.config.borderRadius}px`,
                boxShadow: shadowClasses[previewRegion.config.shadowDepth as keyof typeof shadowClasses] || 'shadow-sm'
              }}
            >
              {/* Preview Header */}
              <div
                className="px-4 py-2 border-b flex items-center justify-between"
                style={{
                  backgroundColor: previewRegion.config.headerColor,
                  borderColor: previewRegion.config.borderColor
                }}
              >
                <h3 className={`font-semibold truncate ${fontSizeClasses[previewRegion.config.fontSize as keyof typeof fontSizeClasses] || 'text-sm'}`}>
                  {previewRegion.config.title || previewRegion.region_type.replace('-', ' ')}
                </h3>
                {previewRegion.is_locked && (
                  <span className="text-xs text-gray-500">🔒</span>
                )}
              </div>
              {/* Preview Content */}
              <div
                className="p-4"
                style={{
                  padding: `${previewRegion.config.padding}px`,
                  fontSize: previewRegion.config.fontSize === 'small' ? '0.75rem' : 
                           previewRegion.config.fontSize === 'large' ? '1rem' : '0.875rem'
                }}
              >
                <p className="text-gray-600 text-sm">
                  {previewRegion.config.description || 'Preview of your region settings'}
                </p>
                <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-xs text-gray-500">
                    This is how your region will appear with the current settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !hasChanges}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
