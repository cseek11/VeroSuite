"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkbox = exports.Skeleton = exports.Spinner = exports.Switch = exports.SelectValue = exports.SelectItem = exports.SelectContent = exports.SelectTrigger = exports.Select = exports.DialogTrigger = exports.DialogFooter = exports.DialogTitle = exports.DialogHeader = exports.DialogContent = exports.Dialog = exports.TabsContent = exports.TabsTrigger = exports.TabsList = exports.Tabs = exports.Separator = exports.Divider = exports.Badge = exports.Text = exports.Heading = exports.Grid = exports.Container = exports.Status = exports.CRMSelect = exports.CRMTextarea = exports.CRMInput = exports.CRMButton = exports.CRMCard = exports.Chip = exports.Collapse = exports.Dropdown = exports.Navbar = exports.Typography = exports.Tooltip = exports.Textarea = exports.ProgressBar = exports.Modal = exports.Input = exports.IconButton = exports.Card = exports.Button = exports.Avatar = exports.AlertDescription = exports.Alert = exports.LoadingOverlay = exports.ErrorMessage = void 0;
exports.PromptDialog = exports.ConfirmDialog = exports.AlertDialog = exports.CustomerSearchSelector = exports.ReusablePopup = void 0;
// ============================================================================
// UI Components Exports
// ============================================================================
var ErrorMessage_1 = require("./ErrorMessage");
Object.defineProperty(exports, "ErrorMessage", { enumerable: true, get: function () { return ErrorMessage_1.ErrorMessage; } });
var LoadingOverlay_1 = require("./LoadingOverlay");
Object.defineProperty(exports, "LoadingOverlay", { enumerable: true, get: function () { return LoadingOverlay_1.LoadingOverlay; } });
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
var EnhancedUI_1 = require("./EnhancedUI");
Object.defineProperty(exports, "Alert", { enumerable: true, get: function () { return EnhancedUI_1.Alert; } });
Object.defineProperty(exports, "AlertDescription", { enumerable: true, get: function () { return EnhancedUI_1.AlertDescription; } });
Object.defineProperty(exports, "Avatar", { enumerable: true, get: function () { return EnhancedUI_1.Avatar; } });
Object.defineProperty(exports, "Button", { enumerable: true, get: function () { return EnhancedUI_1.Button; } });
Object.defineProperty(exports, "Card", { enumerable: true, get: function () { return EnhancedUI_1.Card; } });
Object.defineProperty(exports, "IconButton", { enumerable: true, get: function () { return EnhancedUI_1.IconButton; } });
Object.defineProperty(exports, "Input", { enumerable: true, get: function () { return EnhancedUI_1.Input; } });
Object.defineProperty(exports, "Modal", { enumerable: true, get: function () { return EnhancedUI_1.Modal; } });
Object.defineProperty(exports, "ProgressBar", { enumerable: true, get: function () { return EnhancedUI_1.ProgressBar; } });
Object.defineProperty(exports, "Textarea", { enumerable: true, get: function () { return EnhancedUI_1.Textarea; } });
Object.defineProperty(exports, "Tooltip", { enumerable: true, get: function () { return EnhancedUI_1.Tooltip; } });
Object.defineProperty(exports, "Typography", { enumerable: true, get: function () { return EnhancedUI_1.Typography; } });
Object.defineProperty(exports, "Navbar", { enumerable: true, get: function () { return EnhancedUI_1.Navbar; } });
Object.defineProperty(exports, "Dropdown", { enumerable: true, get: function () { return EnhancedUI_1.Dropdown; } });
Object.defineProperty(exports, "Collapse", { enumerable: true, get: function () { return EnhancedUI_1.Collapse; } });
Object.defineProperty(exports, "Chip", { enumerable: true, get: function () { return EnhancedUI_1.Chip; } });
// Export new CRM components
var CRMComponents_1 = require("./CRMComponents");
Object.defineProperty(exports, "CRMCard", { enumerable: true, get: function () { return CRMComponents_1.Card; } });
Object.defineProperty(exports, "CRMButton", { enumerable: true, get: function () { return CRMComponents_1.Button; } });
Object.defineProperty(exports, "CRMInput", { enumerable: true, get: function () { return CRMComponents_1.Input; } });
Object.defineProperty(exports, "CRMTextarea", { enumerable: true, get: function () { return CRMComponents_1.Textarea; } });
Object.defineProperty(exports, "CRMSelect", { enumerable: true, get: function () { return CRMComponents_1.CRMSelect; } });
Object.defineProperty(exports, "Status", { enumerable: true, get: function () { return CRMComponents_1.Status; } });
Object.defineProperty(exports, "Container", { enumerable: true, get: function () { return CRMComponents_1.Container; } });
Object.defineProperty(exports, "Grid", { enumerable: true, get: function () { return CRMComponents_1.Grid; } });
Object.defineProperty(exports, "Heading", { enumerable: true, get: function () { return CRMComponents_1.Heading; } });
Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return CRMComponents_1.Text; } });
Object.defineProperty(exports, "Badge", { enumerable: true, get: function () { return CRMComponents_1.Badge; } });
Object.defineProperty(exports, "Divider", { enumerable: true, get: function () { return CRMComponents_1.Divider; } });
Object.defineProperty(exports, "Separator", { enumerable: true, get: function () { return CRMComponents_1.Separator; } });
Object.defineProperty(exports, "Tabs", { enumerable: true, get: function () { return CRMComponents_1.Tabs; } });
Object.defineProperty(exports, "TabsList", { enumerable: true, get: function () { return CRMComponents_1.TabsList; } });
Object.defineProperty(exports, "TabsTrigger", { enumerable: true, get: function () { return CRMComponents_1.TabsTrigger; } });
Object.defineProperty(exports, "TabsContent", { enumerable: true, get: function () { return CRMComponents_1.TabsContent; } });
Object.defineProperty(exports, "Dialog", { enumerable: true, get: function () { return CRMComponents_1.Dialog; } });
Object.defineProperty(exports, "DialogContent", { enumerable: true, get: function () { return CRMComponents_1.DialogContent; } });
Object.defineProperty(exports, "DialogHeader", { enumerable: true, get: function () { return CRMComponents_1.DialogHeader; } });
Object.defineProperty(exports, "DialogTitle", { enumerable: true, get: function () { return CRMComponents_1.DialogTitle; } });
Object.defineProperty(exports, "DialogFooter", { enumerable: true, get: function () { return CRMComponents_1.DialogFooter; } });
Object.defineProperty(exports, "DialogTrigger", { enumerable: true, get: function () { return CRMComponents_1.DialogTrigger; } });
Object.defineProperty(exports, "Select", { enumerable: true, get: function () { return CRMComponents_1.Select; } });
Object.defineProperty(exports, "SelectTrigger", { enumerable: true, get: function () { return CRMComponents_1.SelectTrigger; } });
Object.defineProperty(exports, "SelectContent", { enumerable: true, get: function () { return CRMComponents_1.SelectContent; } });
Object.defineProperty(exports, "SelectItem", { enumerable: true, get: function () { return CRMComponents_1.SelectItem; } });
Object.defineProperty(exports, "SelectValue", { enumerable: true, get: function () { return CRMComponents_1.SelectValue; } });
Object.defineProperty(exports, "Switch", { enumerable: true, get: function () { return CRMComponents_1.Switch; } });
Object.defineProperty(exports, "Spinner", { enumerable: true, get: function () { return CRMComponents_1.Spinner; } });
Object.defineProperty(exports, "Skeleton", { enumerable: true, get: function () { return CRMComponents_1.Skeleton; } });
// Export form components
__exportStar(require("./Form"), exports);
// Export individual components
var Checkbox_1 = require("./Checkbox");
Object.defineProperty(exports, "Checkbox", { enumerable: true, get: function () { return __importDefault(Checkbox_1).default; } });
var ReusablePopup_1 = require("./ReusablePopup");
Object.defineProperty(exports, "ReusablePopup", { enumerable: true, get: function () { return __importDefault(ReusablePopup_1).default; } });
var CustomerSearchSelector_1 = require("./CustomerSearchSelector");
Object.defineProperty(exports, "CustomerSearchSelector", { enumerable: true, get: function () { return __importDefault(CustomerSearchSelector_1).default; } });
var DialogModals_1 = require("./DialogModals");
Object.defineProperty(exports, "AlertDialog", { enumerable: true, get: function () { return DialogModals_1.AlertDialog; } });
Object.defineProperty(exports, "ConfirmDialog", { enumerable: true, get: function () { return DialogModals_1.ConfirmDialog; } });
Object.defineProperty(exports, "PromptDialog", { enumerable: true, get: function () { return DialogModals_1.PromptDialog; } });
