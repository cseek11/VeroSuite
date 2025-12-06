import json
import subprocess
from pathlib import Path
from typing import Any, Dict, List, Optional

from enforcement.core.violations import Violation

try:
    from logger_util import get_logger

    logger = get_logger(context="context_bundle_builder")
except ImportError:  # pragma: no cover
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("context_bundle_builder")

        def info(self, msg, *args, **kwargs):
            self._logger.info(msg)

        def debug(self, msg, *args, **kwargs):
            self._logger.debug(msg)

        def warn(self, msg, *args, **kwargs):
            self._logger.warning(msg)

        def warning(self, msg, *args, **kwargs):
            self._logger.warning(msg)

        def error(self, msg, *args, **kwargs):
            self._logger.error(msg)

    logger = _FallbackLogger()


class ContextBundleBuilder:
    """Computes context bundles for Two-Brain reporting."""

    def __init__(self):
        self._project_root: Optional[Path] = None
        self._changed_files: Optional[List[str]] = None

    def build_context_bundle(
        self,
        violations: List[Violation],
        changed_files: List[str],
        project_root: Path,
        git_utils,
    ) -> Dict[str, Any]:
        self._project_root = project_root
        self._changed_files = changed_files

        task_type = self._detect_task_type_unified(violations, git_utils)
        internal_recommendations = self._load_internal_recommendations(project_root)
        hints = self._extract_context_hints_unified(task_type, internal_recommendations)
        relevant_files = self._find_relevant_example_files(task_type, internal_recommendations)
        patterns = self._get_patterns_to_follow_unified(task_type, internal_recommendations)

        return {
            "task_type": task_type,
            "hints": hints,
            "relevant_files": relevant_files,
            "patterns_to_follow": patterns,
        }

    def _detect_task_type_unified(
        self,
        violations: List[Violation],
        git_utils,
    ) -> Optional[str]:
        task_type_from_violations = self._detect_task_type_from_violations(violations)
        if task_type_from_violations:
            return task_type_from_violations

        changed_files = self._changed_files
        if changed_files is None and git_utils:
            try:
                changed_files = git_utils.get_changed_files(include_untracked=False)
            except Exception as exc:  # pragma: no cover - defensive
                logger.warn(
                    f"Failed to fetch changed files for task detection: {exc}",
                    operation="_detect_task_type_unified",
                    error_code="CHANGED_FILES_FAILED",
                )
                changed_files = []

        if not changed_files:
            return None

        file_types = set()
        for file_path in changed_files[:20]:
            lower_path = file_path.lower()
            if file_path.endswith((".ts", ".tsx")):
                file_types.add("typescript")
            elif file_path.endswith(".py"):
                file_types.add("python")
            elif "schema.prisma" in file_path:
                return "database_change"
            elif "auth" in lower_path:
                return "auth_change"
            elif "test" in lower_path:
                return "test_change"

        if "typescript" in file_types or "python" in file_types:
            return "edit_code"

        return "edit_code"

    def _load_internal_recommendations(self, project_root: Path) -> Optional[Dict]:
        recommendations_file = project_root / ".cursor" / "enforcement" / "internal" / "context_recommendations.json"
        if not recommendations_file.exists():
            return None

        try:
            with open(recommendations_file, "r", encoding="utf-8") as file:
                return json.load(file)
        except Exception as exc:
            logger.debug(
                f"Could not load internal recommendations: {exc}",
                operation="_load_internal_recommendations",
                error_code="LOAD_RECOMMENDATIONS_FAILED",
            )
            return None

    def _extract_context_hints_unified(
        self,
        task_type: Optional[str],
        recommendations: Optional[Dict],
    ) -> List[str]:
        hints = self._extract_context_hints(task_type)
        if recommendations and task_type:
            # Reserved for future enhancements (recommendation-specific hints)
            pass
        return hints

    def _find_relevant_example_files(
        self,
        task_type: Optional[str],
        recommendations: Optional[Dict],
    ) -> List[str]:
        example_files = self._get_relevant_example_files(task_type)

        if recommendations:
            context_info = recommendations.get("context", {})
            active_files = context_info.get("active", [])
            code_examples = [
                f
                for f in active_files
                if not f.startswith(".cursor/")
                and (f.endswith(".ts") or f.endswith(".tsx") or f.endswith(".py"))
            ]
            example_files.extend(code_examples[:3])

        seen = set()
        unique_files: List[str] = []
        for file_path in example_files:
            if file_path and file_path not in seen:
                seen.add(file_path)
                unique_files.append(file_path)

        return unique_files[:5]

    def _get_patterns_to_follow_unified(
        self,
        task_type: Optional[str],
        recommendations: Optional[Dict],
    ) -> List[str]:
        patterns = self._get_patterns_to_follow(task_type)
        if recommendations:
            # Reserved for future enhancements (recommendation-specific patterns)
            pass
        return patterns

    def _detect_task_type_from_violations(self, violations: List[Violation]) -> Optional[str]:
        if not violations:
            return None

        for violation in violations:
            rule_ref = violation.rule_ref or violation.message or ""
            rule_ref_lower = rule_ref.lower()

            if "rls" in rule_ref_lower or "tenant" in rule_ref_lower or "security" in rule_ref_lower:
                return "add_rls"
            if "date" in rule_ref_lower or "02-core" in rule_ref_lower:
                return "fix_date"
            if "logging" in rule_ref_lower or "observability" in rule_ref_lower:
                return "add_logging"
            if "error" in rule_ref_lower or "resilience" in rule_ref_lower:
                return "add_error_handling"

        return "fix_violations"

    def _extract_context_hints(self, task_type: Optional[str]) -> List[str]:
        if not task_type:
            return []

        hints_map = {
            "add_rls": [
                "RLS pattern: Filter all queries by tenant_id",
                "Use TenantGuard decorator on controller methods",
                "Example: where: { tenant_id: ctx.user.tenant_id, ... }",
                "Verify tenant_id from authenticated JWT (never from request body)",
                "Test: Add multi-tenant test coverage with different tenant_ids",
            ],
            "add_logging": [
                "Use structured logging: this.logger.warn({ event, user_id, tenant_id, ip, timestamp, ... })",
                "Log security events: AUTH_FAILED, ACCESS_DENIED, RLS_VIOLATION, etc.",
                "Include context: user_id, tenant_id, ip, timestamp, traceId",
                "Never use console.log in production code",
            ],
            "fix_date": [
                "Replace hardcoded dates with: @Inject(SYSTEM_DATE) or inject(SYSTEM_DATE)",
                "Use date abstraction: this.systemDate.now() or similar",
                "Never use: new Date('2025-12-04') or hardcoded date strings",
                "For 'Last Updated' fields: Use current system date dynamically",
            ],
            "add_error_handling": [
                "No silent failures: Always log errors with context",
                "Use try/catch with proper error propagation",
                "Log with traceId and tenantId for correlation",
                "Map errors to appropriate HTTP status codes (400, 422, 500)",
            ],
            "fix_violations": [
                "Review violation descriptions and fix_hints carefully",
                "Follow patterns from similar implementations in codebase",
                "Ensure compliance with rule references",
                "Keep fixes minimal and focused on the violation",
            ],
            "database_change": [
                "Update schema.prisma → Create migration → Update DTOs → Update frontend types",
                "Maintain RLS policies for tenant-scoped tables",
                "Verify tenant isolation is maintained",
                "Test with multiple tenant_ids",
            ],
            "auth_change": [
                "Always validate JWT tokens on every request",
                "Extract tenant_id from validated JWT (never from request)",
                "Use JwtAuthGuard and TenantGuard decorators",
                "Log all authentication events (success and failure)",
            ],
            "test_change": [
                "Add regression tests that reproduce the bug",
                "Test with multiple tenant_ids for multi-tenant features",
                "Verify error handling paths",
                "Check test coverage for new code",
            ],
            "edit_code": [
                "Follow existing patterns in the codebase",
                "Maintain consistency with project structure",
                "Add error handling and logging where appropriate",
                "Verify security compliance (RLS, auth, validation)",
            ],
        }

        return hints_map.get(
            task_type,
            [
                "Review violation descriptions and fix_hints",
                "Follow existing patterns in the codebase",
                "Ensure security and error handling compliance",
            ],
        )

    def _get_relevant_example_files(self, task_type: Optional[str]) -> List[str]:
        if not task_type or not self._project_root:
            return []

        example_files: List[str] = []
        search_patterns = {
            "add_rls": [
                ("tenant_id.*where", "*.ts"),
                ("TenantGuard", "*.ts"),
                ("@UseGuards.*Tenant", "*.ts"),
            ],
            "add_logging": [
                ("logger\\.(warn|error|info)", "*.ts"),
                ("structured.*log", "*.ts"),
            ],
            "fix_date": [
                ("SYSTEM_DATE", "*.ts"),
                ("systemDate", "*.ts"),
                ("inject.*DATE", "*.ts"),
            ],
            "add_error_handling": [
                ("try.*catch", "*.ts"),
                ("AppError", "*.ts"),
                ("HttpException", "*.ts"),
            ],
            "database_change": [
                ("schema\\.prisma", "*.prisma"),
                ("migration", "*.ts"),
            ],
            "auth_change": [
                ("JwtAuthGuard", "*.ts"),
                ("@UseGuards.*Jwt", "*.ts"),
                ("validate.*token", "*.ts"),
            ],
        }

        patterns = search_patterns.get(task_type, [])
        for pattern, file_glob in patterns[:2]:
            try:
                result = subprocess.run(
                    ["git", "grep", "-l", pattern, "--", file_glob],
                    capture_output=True,
                    text=True,
                    timeout=5,
                    cwd=str(self._project_root),
                )
                if result.returncode == 0:
                    files = result.stdout.strip().split("\n")
                    source_files = [f for f in files if f and "test" not in f.lower()][:2]
                    example_files.extend(source_files)
            except Exception:
                pass

        seen = set()
        unique_files: List[str] = []
        for file_path in example_files:
            if file_path and file_path not in seen:
                seen.add(file_path)
                unique_files.append(file_path)

        return unique_files[:5]

    def _get_patterns_to_follow(self, task_type: Optional[str]) -> List[str]:
        if not task_type:
            return []

        patterns_map = {
            "add_rls": [
                "Use TenantGuard decorator on controller methods",
                "Inject tenant_id from authenticated context (JWT)",
                "Filter all queries by tenant_id: where: { tenant_id: ctx.user.tenant_id, ... }",
                "Use Prisma RLS middleware or manual guards",
                "Never trust client-provided tenant_id",
            ],
            "add_logging": [
                "Use structured logger (not console.log)",
                "Include event name, user_id, tenant_id, ip, timestamp",
                "Log security events at WARN level",
                "Include traceId for request correlation",
            ],
            "fix_date": [
                "Use system date injection: @Inject(SYSTEM_DATE)",
                "Never hardcode dates like new Date('2025-12-04')",
                "Use date abstraction layer: this.systemDate.now()",
                "For documentation: Use current system date dynamically",
            ],
            "add_error_handling": [
                "Wrap risky operations in try/catch",
                "Log errors with context (traceId, tenantId, user_id)",
                "Propagate typed errors (AppError, HttpException)",
                "No silent failures - always log or throw",
            ],
            "database_change": [
                "Update schema.prisma → Create migration → Update DTOs → Update frontend types",
                "Maintain RLS policies for tenant-scoped tables",
                "Use prisma.$transaction for multi-step operations",
                "Verify tenant isolation in all queries",
            ],
            "auth_change": [
                "Validate JWT tokens on every request",
                "Extract tenant_id from validated JWT (never from request body)",
                "Use JwtAuthGuard and TenantGuard decorators",
                "Log authentication events (AUTH_SUCCESS, AUTH_FAILED)",
            ],
            "test_change": [
                "Add regression tests that reproduce the bug",
                "Test with multiple tenant_ids for multi-tenant features",
                "Verify error handling paths",
                "Check test coverage meets requirements",
            ],
            "edit_code": [
                "Follow existing patterns in the codebase",
                "Maintain consistency with project structure",
                "Add error handling and logging where appropriate",
                "Verify security compliance (RLS, auth, validation)",
            ],
        }

        return patterns_map.get(
            task_type,
            [
                "Follow existing patterns in the codebase",
                "Ensure security and error handling compliance",
            ],
        )




