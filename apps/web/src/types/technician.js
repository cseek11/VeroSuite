"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicianStatus = exports.EmploymentType = void 0;
var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULL_TIME"] = "full_time";
    EmploymentType["PART_TIME"] = "part_time";
    EmploymentType["CONTRACTOR"] = "contractor";
    EmploymentType["TEMPORARY"] = "temporary";
})(EmploymentType || (exports.EmploymentType = EmploymentType = {}));
var TechnicianStatus;
(function (TechnicianStatus) {
    TechnicianStatus["ACTIVE"] = "active";
    TechnicianStatus["INACTIVE"] = "inactive";
    TechnicianStatus["TERMINATED"] = "terminated";
    TechnicianStatus["ON_LEAVE"] = "on_leave";
})(TechnicianStatus || (exports.TechnicianStatus = TechnicianStatus = {}));
