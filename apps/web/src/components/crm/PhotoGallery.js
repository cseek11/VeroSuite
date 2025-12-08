"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PhotoGallery;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
function PhotoGallery(_a) {
    var photos = _a.photos, _customerId = _a.customerId, isLoading = _a.isLoading;
    var _b = (0, react_1.useState)(null), selectedPhoto = _b[0], setSelectedPhoto = _b[1];
    var _c = (0, react_1.useState)(false), showPhotoModal = _c[0], setShowPhotoModal = _c[1];
    var _d = (0, react_1.useState)('grid'), viewMode = _d[0], setViewMode = _d[1];
    var _e = (0, react_1.useState)('all'), selectedCategory = _e[0], setSelectedCategory = _e[1];
    var _f = (0, react_1.useState)('all'), selectedType = _f[0], setSelectedType = _f[1];
    var getPhotoTypeColor = function (type) {
        switch (type.toLowerCase()) {
            case 'property': return 'bg-blue-100 text-blue-800';
            case 'before_service': return 'bg-red-100 text-red-800';
            case 'after_service': return 'bg-green-100 text-green-800';
            case 'damage': return 'bg-orange-100 text-orange-800';
            case 'pest_evidence': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    var getPhotoCategoryColor = function (category) {
        switch (category.toLowerCase()) {
            case 'profile': return 'bg-blue-100 text-blue-800';
            case 'work_order': return 'bg-green-100 text-green-800';
            case 'inspection': return 'bg-yellow-100 text-yellow-800';
            case 'maintenance': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    var formatFileSize = function (bytes) {
        if (!bytes)
            return '';
        var sizes = ['Bytes', 'KB', 'MB', 'GB'];
        var i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };
    var filteredPhotos = photos.filter(function (photo) {
        if (selectedCategory !== 'all' && photo.photo_category !== selectedCategory)
            return false;
        if (selectedType !== 'all' && photo.photo_type !== selectedType)
            return false;
        return true;
    });
    var categories = __spreadArray(['all'], Array.from(new Set(photos.map(function (p) { return p.photo_category; }))), true);
    var types = __spreadArray(['all'], Array.from(new Set(photos.map(function (p) { return p.photo_type; }))), true);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "text-center py-8", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-slate-600", children: "Loading photos..." }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-slate-900", children: "Photo Gallery" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return setViewMode(viewMode === 'grid' ? 'list' : 'grid'); }, children: viewMode === 'grid' ? (0, jsx_runtime_1.jsx)(lucide_react_1.List, { className: "h-4 w-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Grid, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-1" }), "Upload Photo"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-4 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "h-4 w-4 text-slate-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Category:" }), (0, jsx_runtime_1.jsx)("select", { value: selectedCategory, onChange: function (e) { return setSelectedCategory(e.target.value); }, className: "p-1 border border-slate-300 rounded text-sm", children: categories.map(function (category) { return ((0, jsx_runtime_1.jsx)("option", { value: category, children: category.charAt(0).toUpperCase() + category.slice(1) }, category)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Type:" }), (0, jsx_runtime_1.jsx)("select", { value: selectedType, onChange: function (e) { return setSelectedType(e.target.value); }, className: "p-1 border border-slate-300 rounded text-sm", children: types.map(function (type) { return ((0, jsx_runtime_1.jsx)("option", { value: type, children: type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1) }, type)); }) })] })] }), filteredPhotos.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Camera, { className: "h-12 w-12 text-slate-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900 mb-2", children: "No Photos Found" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-slate-600", children: "No photos match the selected filters." })] })) : ((0, jsx_runtime_1.jsx)("div", { className: viewMode === 'grid'
                            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                            : 'space-y-4', children: filteredPhotos.map(function (photo) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer ".concat(viewMode === 'list' ? 'flex gap-4 p-4' : ''), onClick: function () {
                                setSelectedPhoto(photo);
                                setShowPhotoModal(true);
                            }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative ".concat(viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square'), children: [(0, jsx_runtime_1.jsx)("img", { src: photo.thumbnail_url || photo.file_url, alt: photo.description || 'Customer photo', className: "w-full h-full object-cover" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 left-2", children: (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getPhotoTypeColor(photo.photo_type), children: photo.photo_type.replace('_', ' ') }) }), photo.is_before_photo && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded", children: "Before" }))] }), (0, jsx_runtime_1.jsx)("div", { className: "".concat(viewMode === 'list' ? 'flex-1' : 'p-3'), children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getPhotoCategoryColor(photo.photo_category), children: photo.photo_category }), photo.pest_type && ((0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: "bg-purple-100 text-purple-800", children: photo.pest_type }))] }), photo.description && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-700 line-clamp-2", children: photo.description })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-slate-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { children: formatDate(photo.taken_at) })] }), photo.taken_by && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-slate-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { children: photo.taken_by })] })), photo.location_coords && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-slate-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { children: "GPS" })] })), photo.file_size && ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-slate-500", children: formatFileSize(photo.file_size) }))] }) })] }, photo.id)); }) })), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 grid grid-cols-2 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 p-4 rounded-lg text-center", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-blue-900 font-semibold", children: photos.length }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-blue-600", children: "Total Photos" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-green-50 p-4 rounded-lg text-center", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-green-900 font-semibold", children: photos.filter(function (p) { return p.photo_type === 'before_service'; }).length }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-green-600", children: "Before Photos" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-purple-50 p-4 rounded-lg text-center", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-purple-900 font-semibold", children: photos.filter(function (p) { return p.photo_type === 'pest_evidence'; }).length }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-purple-600", children: "Pest Evidence" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-orange-50 p-4 rounded-lg text-center", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-orange-900 font-semibold", children: photos.filter(function (p) { return p.location_coords; }).length }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-orange-600", children: "GPS Tagged" })] })] })] }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showPhotoModal, onOpenChange: function (open) { return !open && setShowPhotoModal(false); }, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-4xl", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(ui_1.DialogTitle, { children: "Photo Details" }) }), selectedPhoto && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("img", { src: selectedPhoto.file_url, alt: selectedPhoto.description || 'Customer photo', className: "w-full h-96 object-cover rounded-lg" }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute top-4 left-4 flex gap-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getPhotoTypeColor(selectedPhoto.photo_type), children: selectedPhoto.photo_type.replace('_', ' ') }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getPhotoCategoryColor(selectedPhoto.photo_category), children: selectedPhoto.photo_category }), selectedPhoto.is_before_photo && ((0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: "bg-red-100 text-red-800", children: "Before" }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Taken At" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: formatDate(selectedPhoto.taken_at) })] }), selectedPhoto.taken_by && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Taken By" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedPhoto.taken_by })] })), selectedPhoto.location_coords && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "GPS Coordinates" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedPhoto.location_coords })] })), selectedPhoto.treatment_area && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Treatment Area" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedPhoto.treatment_area })] })), selectedPhoto.pest_type && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Pest Type" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedPhoto.pest_type })] })), selectedPhoto.file_size && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "File Size" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: formatFileSize(selectedPhoto.file_size) })] }))] }), selectedPhoto.description && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600 mb-2", children: "Description" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedPhoto.description })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 justify-end", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-4 w-4 mr-1" }), "Download"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Share2, { className: "h-4 w-4 mr-1" }), "Share"] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowPhotoModal(false); }, children: "Close" })] })] }))] }) })] }));
}
