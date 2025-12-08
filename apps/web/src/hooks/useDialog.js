"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDialog = useDialog;
var react_1 = __importStar(require("react"));
var DialogModals_1 = require("@/components/ui/DialogModals");
function useDialog() {
    var _a = (0, react_1.useState)({
        open: false,
        title: '',
        message: '',
        type: 'info',
    }), alertState = _a[0], setAlertState = _a[1];
    var _b = (0, react_1.useState)({
        open: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'warning',
    }), confirmState = _b[0], setConfirmState = _b[1];
    var confirmResolveRef = (0, react_1.useRef)(null);
    var showAlert = (0, react_1.useCallback)(function (options) {
        return new Promise(function (resolve) {
            setAlertState({
                open: true,
                title: options.title,
                message: options.message,
                type: options.type || 'info',
            });
            // Store resolve to call when dialog closes
            var originalClose = function () {
                setAlertState(function (prev) { return (__assign(__assign({}, prev), { open: false })); });
                resolve();
            };
            window.__alertResolve = originalClose;
        });
    }, []);
    var showConfirm = (0, react_1.useCallback)(function (options) {
        return new Promise(function (resolve) {
            confirmResolveRef.current = resolve;
            setConfirmState({
                open: true,
                title: options.title,
                message: options.message,
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                type: options.type || 'warning',
            });
        });
    }, []);
    var handleAlertClose = (0, react_1.useCallback)(function (open) {
        if (!open) {
            setAlertState(function (prev) { return (__assign(__assign({}, prev), { open: false })); });
            if (window.__alertResolve) {
                window.__alertResolve();
                delete window.__alertResolve;
            }
        }
    }, []);
    var handleConfirm = (0, react_1.useCallback)(function () {
        if (confirmResolveRef.current) {
            confirmResolveRef.current(true);
            confirmResolveRef.current = null;
        }
        setConfirmState(function (prev) { return (__assign(__assign({}, prev), { open: false })); });
    }, []);
    var handleCancel = (0, react_1.useCallback)(function () {
        if (confirmResolveRef.current) {
            confirmResolveRef.current(false);
            confirmResolveRef.current = null;
        }
        setConfirmState(function (prev) { return (__assign(__assign({}, prev), { open: false })); });
    }, []);
    var handleConfirmClose = (0, react_1.useCallback)(function (open) {
        if (!open) {
            handleCancel();
        }
    }, [handleCancel]);
    var DialogComponents = function () {
        return react_1.default.createElement(react_1.default.Fragment, null, react_1.default.createElement(DialogModals_1.AlertDialog, {
            open: alertState.open,
            onOpenChange: handleAlertClose,
            title: alertState.title,
            message: alertState.message,
            type: alertState.type,
        }), react_1.default.createElement(DialogModals_1.ConfirmDialog, {
            open: confirmState.open,
            onOpenChange: handleConfirmClose,
            onConfirm: handleConfirm,
            title: confirmState.title,
            message: confirmState.message,
            confirmText: confirmState.confirmText,
            cancelText: confirmState.cancelText,
            type: confirmState.type,
        }));
    };
    return {
        showAlert: showAlert,
        showConfirm: showConfirm,
        DialogComponents: DialogComponents,
    };
}
