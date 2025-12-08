"use strict";
/**
 * Compliance Types
 * TypeScript types for compliance dashboard
 *
 * Last Updated: 2025-12-07
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceSeverity = exports.ComplianceStatus = exports.RuleTier = void 0;
var RuleTier;
(function (RuleTier) {
    RuleTier["BLOCK"] = "BLOCK";
    RuleTier["OVERRIDE"] = "OVERRIDE";
    RuleTier["WARNING"] = "WARNING";
})(RuleTier || (exports.RuleTier = RuleTier = {}));
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["PASS"] = "PASS";
    ComplianceStatus["VIOLATION"] = "VIOLATION";
    ComplianceStatus["OVERRIDE"] = "OVERRIDE";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
var ComplianceSeverity;
(function (ComplianceSeverity) {
    ComplianceSeverity["BLOCK"] = "BLOCK";
    ComplianceSeverity["OVERRIDE"] = "OVERRIDE";
    ComplianceSeverity["WARNING"] = "WARNING";
})(ComplianceSeverity || (exports.ComplianceSeverity = ComplianceSeverity = {}));
