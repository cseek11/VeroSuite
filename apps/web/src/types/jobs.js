"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canChangeJobStatus = exports.getNextJobStatuses = exports.getJobStatusLabel = exports.getJobStatusColor = exports.JobStatus = void 0;
var JobStatus;
(function (JobStatus) {
    JobStatus["SCHEDULED"] = "scheduled";
    JobStatus["IN_PROGRESS"] = "in_progress";
    JobStatus["COMPLETED"] = "completed";
    JobStatus["CANCELED"] = "canceled";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
// Job status display helpers
var getJobStatusColor = function (status) {
    switch (status) {
        case JobStatus.SCHEDULED:
            return 'blue';
        case JobStatus.IN_PROGRESS:
            return 'yellow';
        case JobStatus.COMPLETED:
            return 'green';
        case JobStatus.CANCELED:
            return 'red';
        default:
            return 'gray';
    }
};
exports.getJobStatusColor = getJobStatusColor;
var getJobStatusLabel = function (status) {
    switch (status) {
        case JobStatus.SCHEDULED:
            return 'Scheduled';
        case JobStatus.IN_PROGRESS:
            return 'In Progress';
        case JobStatus.COMPLETED:
            return 'Completed';
        case JobStatus.CANCELED:
            return 'Canceled';
        default:
            return 'Unknown';
    }
};
exports.getJobStatusLabel = getJobStatusLabel;
// Job status workflow helpers
var getNextJobStatuses = function (currentStatus) {
    switch (currentStatus) {
        case JobStatus.SCHEDULED:
            return [JobStatus.IN_PROGRESS, JobStatus.CANCELED];
        case JobStatus.IN_PROGRESS:
            return [JobStatus.COMPLETED, JobStatus.CANCELED];
        case JobStatus.COMPLETED:
            return []; // No transitions from completed
        case JobStatus.CANCELED:
            return [JobStatus.SCHEDULED]; // Can reschedule canceled jobs
        default:
            return [];
    }
};
exports.getNextJobStatuses = getNextJobStatuses;
var canChangeJobStatus = function (from, to) {
    return (0, exports.getNextJobStatuses)(from).includes(to);
};
exports.canChangeJobStatus = canChangeJobStatus;
