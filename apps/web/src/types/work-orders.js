"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canChangeStatus = exports.getNextStatuses = exports.getPriorityLabel = exports.getPriorityColor = exports.getStatusLabel = exports.getStatusColor = exports.WorkOrderPriority = exports.WorkOrderStatus = void 0;
var WorkOrderStatus;
(function (WorkOrderStatus) {
    WorkOrderStatus["PENDING"] = "pending";
    WorkOrderStatus["IN_PROGRESS"] = "in-progress";
    WorkOrderStatus["COMPLETED"] = "completed";
    WorkOrderStatus["CANCELED"] = "canceled";
})(WorkOrderStatus || (exports.WorkOrderStatus = WorkOrderStatus = {}));
var WorkOrderPriority;
(function (WorkOrderPriority) {
    WorkOrderPriority["LOW"] = "low";
    WorkOrderPriority["MEDIUM"] = "medium";
    WorkOrderPriority["HIGH"] = "high";
    WorkOrderPriority["URGENT"] = "urgent";
})(WorkOrderPriority || (exports.WorkOrderPriority = WorkOrderPriority = {}));
// Status display helpers
var getStatusColor = function (status) {
    switch (status) {
        case WorkOrderStatus.PENDING:
            return 'yellow';
        case WorkOrderStatus.IN_PROGRESS:
            return 'blue';
        case WorkOrderStatus.COMPLETED:
            return 'green';
        case WorkOrderStatus.CANCELED:
            return 'red';
        default:
            return 'gray';
    }
};
exports.getStatusColor = getStatusColor;
var getStatusLabel = function (status) {
    switch (status) {
        case WorkOrderStatus.PENDING:
            return 'Pending';
        case WorkOrderStatus.IN_PROGRESS:
            return 'In Progress';
        case WorkOrderStatus.COMPLETED:
            return 'Completed';
        case WorkOrderStatus.CANCELED:
            return 'Canceled';
        default:
            return 'Unknown';
    }
};
exports.getStatusLabel = getStatusLabel;
var getPriorityColor = function (priority) {
    switch (priority) {
        case WorkOrderPriority.LOW:
            return 'green';
        case WorkOrderPriority.MEDIUM:
            return 'yellow';
        case WorkOrderPriority.HIGH:
            return 'orange';
        case WorkOrderPriority.URGENT:
            return 'red';
        default:
            return 'gray';
    }
};
exports.getPriorityColor = getPriorityColor;
var getPriorityLabel = function (priority) {
    switch (priority) {
        case WorkOrderPriority.LOW:
            return 'Low';
        case WorkOrderPriority.MEDIUM:
            return 'Medium';
        case WorkOrderPriority.HIGH:
            return 'High';
        case WorkOrderPriority.URGENT:
            return 'Urgent';
        default:
            return 'Unknown';
    }
};
exports.getPriorityLabel = getPriorityLabel;
// Status workflow helpers
var getNextStatuses = function (currentStatus) {
    switch (currentStatus) {
        case WorkOrderStatus.PENDING:
            return [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELED];
        case WorkOrderStatus.IN_PROGRESS:
            return [WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELED];
        case WorkOrderStatus.COMPLETED:
            return []; // No transitions from completed
        case WorkOrderStatus.CANCELED:
            return [WorkOrderStatus.PENDING]; // Can reactivate canceled orders
        default:
            return [];
    }
};
exports.getNextStatuses = getNextStatuses;
var canChangeStatus = function (from, to) {
    return (0, exports.getNextStatuses)(from).includes(to);
};
exports.canChangeStatus = canChangeStatus;
