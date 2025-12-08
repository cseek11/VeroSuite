"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModalManagement = void 0;
var react_1 = require("react");
var useModalManagement = function () {
    var _a = (0, react_1.useState)({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    }), alertModal = _a[0], setAlertModal = _a[1];
    var _b = (0, react_1.useState)({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: function () { },
        type: 'warning'
    }), confirmModal = _b[0], setConfirmModal = _b[1];
    var _c = (0, react_1.useState)({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: function (_value) { },
        placeholder: '',
        defaultValue: '',
        type: 'info'
    }), promptModal = _c[0], setPromptModal = _c[1];
    var _d = (0, react_1.useState)({
        isOpen: false,
        groupId: '',
        groupName: ''
    }), groupDeleteModal = _d[0], setGroupDeleteModal = _d[1];
    return {
        alertModal: alertModal,
        setAlertModal: setAlertModal,
        confirmModal: confirmModal,
        setConfirmModal: setConfirmModal,
        promptModal: promptModal,
        setPromptModal: setPromptModal,
        groupDeleteModal: groupDeleteModal,
        setGroupDeleteModal: setGroupDeleteModal
    };
};
exports.useModalManagement = useModalManagement;
