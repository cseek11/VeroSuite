// ============================================================================
// UI Components Exports
// ============================================================================
export { ErrorMessage } from './ErrorMessage';
export { LoadingOverlay } from './LoadingOverlay';
export { default as ErrorMessage } from './ErrorMessage';
export { default as LoadingOverlay } from './LoadingOverlay';

// ============================================================================
// DEPRECATED: EnhancedUI Components
// ============================================================================
// ⚠️  These components are DEPRECATED and should NOT be used in new code.
// 
// Migration Status: 100% Complete (38/38 files migrated)
// - All identified files have been migrated to standard UI components
// - Last migrated: AgreementsPage.tsx
//
// Migration Guide:
// - Typography → Heading/Text from '@/components/ui'
// - Chip → Badge from '@/components/ui'
// - Modal → Dialog components from '@/components/ui'
// - Alert → Inline styled divs
// - ProgressBar → Inline styled divs
// - Card, Button, Input → Direct imports from '@/components/ui/Card', etc.
//
// These exports are kept temporarily for backward compatibility only.
// They will be removed in a future version.
// ============================================================================
export {
  Alert,
  AlertDescription,
  Avatar,
  Button,
  Card,
  IconButton,
  Input,
  Modal,
  ProgressBar,
  Textarea,
  Tooltip,
  Typography,
  Navbar,
  Dropdown,
  Collapse,
  Chip
} from './EnhancedUI';

// Export new CRM components
export {
  Card as CRMCard,
  Button as CRMButton,
  Input as CRMInput,
  Textarea as CRMTextarea,
  CRMSelect,
  Status,
  Container,
  Grid,
  Heading,
  Text,
  Badge,
  Divider,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Switch,
  Spinner,
  Skeleton
} from './CRMComponents';

// Export form components
export * from './Form';

// Export individual components
export { default as Checkbox } from './Checkbox';
export { default as ReusablePopup } from './ReusablePopup';
export { default as CustomerSearchSelector } from './CustomerSearchSelector';
export { AlertDialog, ConfirmDialog, PromptDialog } from './DialogModals';
