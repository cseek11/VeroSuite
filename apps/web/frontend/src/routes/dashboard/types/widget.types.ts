export interface WidgetManifest {
  widget_id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  entry_point: string;
  config_schema?: any;
  permissions?: string[];
  pii_tags?: string[];
  performance_budget?: number;
}

export interface WidgetConfig {
  [key: string]: any;
}

export interface WidgetMessage {
  type: 'init' | 'render' | 'destroy' | 'update' | 'error' | 'ready';
  payload?: any;
  widgetId?: string;
}

export interface WidgetLifecycleHooks {
  onInit?: (config: WidgetConfig) => void;
  onRender?: (config: WidgetConfig) => void;
  onDestroy?: () => void;
  onUpdate?: (config: WidgetConfig) => void;
}

export interface WidgetSandboxProps {
  widgetId: string;
  manifest: WidgetManifest;
  config: WidgetConfig;
  onError?: (error: Error) => void;
  onReady?: () => void;
  onMessage?: (message: WidgetMessage) => void;
}





