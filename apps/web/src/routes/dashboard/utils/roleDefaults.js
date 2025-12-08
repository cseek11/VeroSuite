"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleDefaultsMap = exports.adminDefaults = exports.managerDefaults = exports.technicianDefaults = void 0;
exports.getRoleDefaults = getRoleDefaults;
var region_types_1 = require("../types/region.types");
exports.technicianDefaults = [
    {
        region_type: region_types_1.RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 2,
        col_span: 1,
        min_width: 300,
        min_height: 400
    },
    {
        region_type: region_types_1.RegionType.CUSTOMER_SEARCH,
        grid_row: 0,
        grid_col: 1,
        row_span: 1,
        col_span: 1,
        min_width: 300,
        min_height: 200
    },
    {
        region_type: region_types_1.RegionType.QUICK_ACTIONS,
        grid_row: 1,
        grid_col: 1,
        row_span: 1,
        col_span: 1,
        min_width: 300,
        min_height: 200
    },
    {
        region_type: region_types_1.RegionType.REPORTS,
        grid_row: 2,
        grid_col: 0,
        row_span: 1,
        col_span: 2,
        min_width: 600,
        min_height: 200
    }
];
exports.managerDefaults = [
    {
        region_type: region_types_1.RegionType.REPORTS,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1,
        min_width: 300,
        min_height: 300
    },
    {
        region_type: region_types_1.RegionType.TEAM_OVERVIEW,
        grid_row: 0,
        grid_col: 1,
        row_span: 1,
        col_span: 1,
        min_width: 300,
        min_height: 300
    },
    {
        region_type: region_types_1.RegionType.SCHEDULING,
        grid_row: 1,
        grid_col: 0,
        row_span: 1,
        col_span: 1,
        min_width: 300,
        min_height: 300
    },
    {
        region_type: region_types_1.RegionType.ANALYTICS,
        grid_row: 1,
        grid_col: 1,
        row_span: 1,
        col_span: 1,
        min_width: 300,
        min_height: 300
    }
];
exports.adminDefaults = [
    {
        region_type: region_types_1.RegionType.SETTINGS,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1,
        min_width: 300,
        min_height: 300
    },
    {
        region_type: region_types_1.RegionType.REPORTS,
        grid_row: 0,
        grid_col: 1,
        row_span: 1,
        col_span: 1,
        min_width: 300,
        min_height: 300
    },
    {
        region_type: region_types_1.RegionType.ANALYTICS,
        grid_row: 1,
        grid_col: 0,
        row_span: 1,
        col_span: 2,
        min_width: 600,
        min_height: 300
    }
];
exports.roleDefaultsMap = {
    technician: exports.technicianDefaults,
    manager: exports.managerDefaults,
    admin: exports.adminDefaults
};
function getRoleDefaults(role) {
    return exports.roleDefaultsMap[role] || [];
}
