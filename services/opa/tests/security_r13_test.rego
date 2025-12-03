package compliance.security_test

import data.compliance.security
import rego.v1

# =============================================================================
# R13: INPUT VALIDATION TESTS
# =============================================================================

# Test 1: DTO validation present (no violation)
test_dto_validation_present if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/user/dto/create-user.dto.ts",
			"diff": "@IsString()\n@MaxLength(100)\nemail!: string;",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 2: Missing DTO validation (violation)
test_missing_dto_validation if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/user/user.controller.ts",
			"diff": "@Post()\nasync create(@Body() data: any) {\n  return this.service.create(data);\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 1 with input as mock_input

	violation := [msg | msg := security.deny[_]][0]
	contains(violation, "OVERRIDE REQUIRED [Security/R13]")
	contains(violation, "uses 'any' type for @Body()")
}

# Test 3: Missing validation decorators (violation)
test_missing_validation_decorators if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/user/dto/create-user.dto.ts",
			"diff": "export class CreateUserDto {\n  email!: string;\n  name!: string;\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 1 with input as mock_input

	violation := [msg | msg := security.deny[_]][0]
	contains(violation, "properties without validation decorators")
}

# Test 4: File upload validation present (no violation)
test_file_upload_validation_present if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/upload/upload.controller.ts",
			"diff": "@Post('upload')\n@UseInterceptors(FileInterceptor('file'))\n@MaxFileSize(5 * 1024 * 1024)\n@FileType(['image/jpeg', 'image/png'])\nasync upload(@UploadedFile() file: Express.Multer.File) {\n  return this.service.upload(file);\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 5: Missing file upload validation (violation)
test_missing_file_upload_validation if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/upload/upload.controller.ts",
			"diff": "@Post('upload')\nasync upload(@UploadedFile() file: Express.Multer.File) {\n  return this.service.upload(file);\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 1 with input as mock_input

	violation := [msg | msg := security.deny[_]][0]
	contains(violation, "File upload")
	contains(violation, "without validation")
}

# Test 6: XSS sanitization present (no violation)
test_xss_sanitization_present if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/user/user.service.ts",
			"diff": "async updateDescription(userId: string, description: string) {\n  const sanitized = sanitizeHtml(description);\n  return this.prisma.user.update({\n    where: { id: userId },\n    data: { description: sanitized }\n  });\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 7: Missing XSS sanitization (violation)
test_missing_xss_sanitization if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/user/user.service.ts",
			"diff": "async updateDescription(userId: string, description: string) {\n  return this.prisma.user.update({\n    where: { id: userId },\n    data: { description: description }\n  });\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 1 with input as mock_input

	violation := [msg | msg := security.deny[_]][0]
	contains(violation, "stored without sanitization")
}

# Test 8: SQL parameterization present (no violation)
test_sql_parameterization_present if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/user/user.service.ts",
			"diff": "async findUser(email: string) {\n  return this.prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`;\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 9: SQL injection risk (violation)
test_sql_injection_risk if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/user/user.service.ts",
			"diff": "async findUser(email: string) {\n  return this.prisma.$queryRawUnsafe(`SELECT * FROM users WHERE email = '${email}'`);\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 1 with input as mock_input

	violation := [msg | msg := security.deny[_]][0]
	contains(violation, "SQL injection risk")
}

# Test 10: Path validation present (no violation)
test_path_validation_present if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/file/file.service.ts",
			"diff": "async getFile(filename: string) {\n  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) throw new Error('Invalid filename');\n  const safePath = path.resolve(UPLOAD_DIR, filename);\n  return fs.readFileSync(safePath);\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 11: Path traversal risk (violation)
test_path_traversal_risk if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/file/file.service.ts",
			"diff": "async getFile(filename: string) {\n  return fs.readFileSync(filename);\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 1 with input as mock_input

	violation := [msg | msg := security.deny[_]][0]
	contains(violation, "Path traversal risk")
}

# Test 12: Size limits present (no violation)
test_size_limits_present if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/user/dto/create-user.dto.ts",
			"diff": "@IsString()\n@MaxLength(255)\nemail!: string;",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 13: Missing size limits (violation)
test_missing_size_limits if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/user/dto/create-user.dto.ts",
			"diff": "@IsString()\nemail!: string;",
		}],
		"pr_body": "",
	}

	count(security.deny) == 1 with input as mock_input

	violation := [msg | msg := security.deny[_]][0]
	contains(violation, "without size limits")
}

# Test 14: Override marker bypasses violation
test_override_marker_bypasses_violation if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/user/user.controller.ts",
			"diff": "@Post()\nasync create(@Body() data: any) {\n  return this.service.create(data);\n}",
		}],
		"pr_body": "@override:input-validation - Legacy endpoint, migration planned for Q2",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 15: Config sanitization warning
test_config_sanitization_warning if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/widget/widget.service.ts",
			"diff": "async updateConfig(widgetId: string, config: any) {\n  return this.prisma.widget.update({\n    where: { id: widgetId },\n    data: { config: config }\n  });\n}",
		}],
		"pr_body": "",
	}

	count(security.warn) == 1 with input as mock_input

	warning := [msg | msg := security.warn[_]][0]
	contains(warning, "WARNING [Security/R13]")
	contains(warning, "Config object")
}

# Test 16: Validation message warning
test_validation_message_warning if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/user/dto/create-user.dto.ts",
			"diff": "@IsString()\nemail!: string;",
		}],
		"pr_body": "",
	}

	count(security.warn) >= 1 with input as mock_input

	warning := [msg | msg := security.warn[_]; contains(msg, "custom error messages")][0]
	contains(warning, "WARNING [Security/R13]")
}

# Test 17: Multiple violations in one file
test_multiple_violations if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/user/user.controller.ts",
			"diff": "@Post()\nasync create(@Body() data: any) {\n  return this.service.create(data);\n}\n\n@Post('upload')\nasync upload(@UploadedFile() file: Express.Multer.File) {\n  return this.service.upload(file);\n}",
		}],
		"pr_body": "",
	}

	# Should detect both missing DTO validation and missing file validation
	count(security.deny) >= 2 with input as mock_input
}

# Test 18: HTML content field without sanitization (violation)
test_html_content_without_sanitization if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/post/post.service.ts",
			"diff": "async createPost(data: CreatePostDto) {\n  return this.prisma.post.create({\n    data: {\n      content: data.content,\n      html: data.html\n    }\n  });\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) >= 1 with input as mock_input

	violation := [msg | msg := security.deny[_]; contains(msg, "sanitization")][0]
	contains(violation, "stored without sanitization")
}

# Test 19: dangerouslySetInnerHTML without sanitization (violation)
test_dangerous_inner_html_without_sanitization if {
	mock_input := {
		"changed_files": [{
			"path": "frontend/src/components/UserProfile.tsx",
			"diff": "function UserProfile({ html }: { html: string }) {\n  return <div dangerouslySetInnerHTML={{ __html: html }} />;\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) >= 1 with input as mock_input

	violation := [msg | msg := security.deny[_]; contains(msg, "dangerouslySetInnerHTML")][0]
	contains(violation, "without sanitization")
}

# Test 20: Non-validation file (no violation)
test_non_validation_file if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/utils/helpers.ts",
			"diff": "export function formatDate(date: Date): string {\n  return date.toISOString();\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}
