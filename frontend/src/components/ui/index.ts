// Export existing EnhancedUI components (excluding duplicates)
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
