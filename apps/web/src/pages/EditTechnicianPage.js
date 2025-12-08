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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var TechnicianForm_1 = __importDefault(require("../components/technicians/TechnicianForm"));
var EditTechnicianPage = function () {
    var id = (0, react_router_dom_1.useParams)().id;
    return (0, jsx_runtime_1.jsx)(TechnicianForm_1.default, __assign({}, (id !== undefined && id !== null ? { technicianId: id } : {}), { isEdit: true }));
};
exports.default = EditTechnicianPage;
