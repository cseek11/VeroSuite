# R13: Input Validation — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-12-04  
**Rule:** R13 - Input Validation  
**Priority:** HIGH (Tier 2 - OVERRIDE)  
**MAD Tier:** 2 (OVERRIDE REQUIRED - Needs justification)

---

## Purpose

R13 ensures all user inputs are properly validated to prevent:
- **Injection Attacks:** SQL injection, XSS, command injection, NoSQL injection
- **Buffer Overflow:** Input size limits enforced
- **Data Corruption:** Type validation, format validation
- **Business Logic Bypass:** Business rule validation
- **Denial of Service:** Rate limiting, size limits

**Key Requirements:**
- All user inputs must be validated on the backend
- Use shared validation constants consistently
- Enforce input size limits
- Validate file uploads (type, size, content)
- Sanitize HTML content to prevent XSS
- Use parameterized queries (Prisma handles this)
- Validate against schemas (DTOs, JSON Schema)

---

## Step 5: Post-Implementation Audit for Input Validation

### R13: Input Validation — Audit Procedures

**For code changes affecting API endpoints, DTOs, file uploads, or user input handling:**

#### DTO Validation

- [ ] **MANDATORY:** Verify DTOs exist for all request bodies (`@Body()` parameters)
- [ ] **MANDATORY:** Verify DTOs use `class-validator` decorators (`@IsString()`, `@IsEmail()`, etc.)
- [ ] **MANDATORY:** Verify DTOs have no `any` types
- [ ] **MANDATORY:** Verify DTOs validate required fields (not optional without `@IsOptional()`)
- [ ] **MANDATORY:** Verify DTOs validate optional fields (`@IsOptional()` decorator)
- [ ] **MANDATORY:** Verify DTOs enforce size limits (`@MaxLength()`, `@MinLength()`, `@Length()`)
- [ ] **MANDATORY:** Verify DTOs validate formats (`@IsEmail()`, `@IsUUID()`, `@Matches()`)
- [ ] **MANDATORY:** Verify DTOs validate ranges (`@Min()`, `@Max()`, `@IsInt()`)
- [ ] **MANDATORY:** Verify DTOs validate enums (`@IsEnum()`)
- [ ] **MANDATORY:** Verify DTOs validate nested objects (`@ValidateNested()`, `@Type()`)
- [ ] **MANDATORY:** Verify DTOs validate arrays (`@IsArray()`, `@ArrayMinSize()`, `@ArrayMaxSize()`)
- [ ] **MANDATORY:** Verify DTOs use proper validation messages (user-friendly)
- [ ] **RECOMMENDED:** Verify DTOs use shared validation constants (from `libs/common/src/validation/`)

#### Controller Validation

- [ ] **MANDATORY:** Verify controllers use DTOs for `@Body()` parameters (not `any`)
- [ ] **MANDATORY:** Verify controllers use DTOs for `@Query()` parameters (when complex)
- [ ] **MANDATORY:** Verify controllers use DTOs for `@Param()` parameters (when complex)
- [ ] **MANDATORY:** Verify controllers use `ValidationPipe` (global or per-route)
- [ ] **MANDATORY:** Verify controllers validate path parameters (UUIDs, IDs)
- [ ] **MANDATORY:** Verify controllers validate query parameters (pagination, filters)
- [ ] **RECOMMENDED:** Verify controllers use custom validators when needed (`@Validate()`)

#### File Upload Validation

- [ ] **MANDATORY:** Verify file uploads validate file type (MIME type, extension)
- [ ] **MANDATORY:** Verify file uploads validate file size (max size limit)
- [ ] **MANDATORY:** Verify file uploads validate file content (not just extension)
- [ ] **MANDATORY:** Verify file uploads use DTOs with `@IsFile()`, `@MaxFileSize()`, `@FileType()` decorators
- [ ] **MANDATORY:** Verify file uploads scan for malware (if applicable)
- [ ] **MANDATORY:** Verify file uploads store files securely (not in public directory)
- [ ] **MANDATORY:** Verify file uploads use unique filenames (prevent overwrites)
- [ ] **RECOMMENDED:** Verify file uploads validate image dimensions (for images)

#### XSS Prevention

- [ ] **MANDATORY:** Verify HTML content is sanitized before storage
- [ ] **MANDATORY:** Verify config objects are sanitized recursively
- [ ] **MANDATORY:** Verify XSS vectors are detected and removed:
  - Script tags (`<script>`, `</script>`)
  - `javascript:` protocol
  - Event handlers (`onclick`, `onerror`, etc.)
  - `eval()` calls
  - `Function()` constructors
- [ ] **MANDATORY:** Verify widget configs are sanitized before storage
- [ ] **MANDATORY:** Verify frontend uses React's built-in XSS protection
- [ ] **MANDATORY:** Verify `dangerouslySetInnerHTML` is not used without sanitization
- [ ] **MANDATORY:** Verify sanitization happens on backend (not just frontend)
- [ ] **RECOMMENDED:** Verify sanitization uses established libraries (DOMPurify, sanitize-html)

#### Injection Prevention

- [ ] **MANDATORY:** Verify no SQL concatenation (use Prisma parameterized queries)
- [ ] **MANDATORY:** Verify no raw SQL queries without parameterization
- [ ] **MANDATORY:** Verify no command injection (validate shell command inputs)
- [ ] **MANDATORY:** Verify no NoSQL injection (validate MongoDB queries)
- [ ] **MANDATORY:** Verify no LDAP injection (validate LDAP queries)
- [ ] **MANDATORY:** Verify no path traversal (validate file paths)
- [ ] **MANDATORY:** Verify no template injection (validate template inputs)

#### Input Size Limits

- [ ] **MANDATORY:** Verify string inputs have max length limits
- [ ] **MANDATORY:** Verify array inputs have max size limits
- [ ] **MANDATORY:** Verify number inputs have min/max value limits
- [ ] **MANDATORY:** Verify request body size is limited (global middleware)
- [ ] **MANDATORY:** Verify file upload size is limited
- [ ] **MANDATORY:** Verify nested object depth is limited (prevent deep nesting attacks)

#### Business Rule Validation

- [ ] **MANDATORY:** Verify business rules are validated in service layer (not just DTOs)
- [ ] **MANDATORY:** Verify cross-field validation is implemented (`@ValidateIf()`, custom validators)
- [ ] **MANDATORY:** Verify conditional validation is implemented (`@ValidateIf()`)
- [ ] **MANDATORY:** Verify business rules prevent privilege escalation
- [ ] **MANDATORY:** Verify business rules prevent tenant_id manipulation
- [ ] **RECOMMENDED:** Verify business rules use custom validators (`@Validate()`)

#### Error Handling

- [ ] **MANDATORY:** Verify validation errors return appropriate HTTP status (400 Bad Request)
- [ ] **MANDATORY:** Verify validation errors include user-friendly messages
- [ ] **MANDATORY:** Verify validation errors do NOT expose sensitive details (stack traces, internal paths)
- [ ] **MANDATORY:** Verify validation errors are logged (structured logging)
- [ ] **MANDATORY:** Verify validation errors include field names (for user feedback)
- [ ] **RECOMMENDED:** Verify validation errors are rate-limited (prevent enumeration attacks)

#### Shared Validation Constants

- [ ] **MANDATORY:** Verify validation constants are used consistently (from `libs/common/src/validation/`)
- [ ] **MANDATORY:** Verify validation constants define size limits (max length, max size)
- [ ] **MANDATORY:** Verify validation constants define format patterns (email, phone, UUID)
- [ ] **MANDATORY:** Verify validation constants define allowed file types
- [ ] **RECOMMENDED:** Verify validation constants are documented

#### Automated Checks

```bash
# Run input validation checker
python .cursor/scripts/check-input-validation.py --file <file_path>

# Check all changed files
python .cursor/scripts/check-input-validation.py --pr <PR_NUMBER>

# Check specific validation type
python .cursor/scripts/check-input-validation.py --type dto

# Expected: No violations found
```

#### OPA Policy

- **Policy:** `services/opa/policies/security.rego` (R13 section)
- **Enforcement:** OVERRIDE (Tier 2 MAD) - Requires justification
- **Tests:** `services/opa/tests/security_r13_test.rego`

#### Manual Verification (When Needed)

1. **Review Input Sources** - Identify all user input sources (body, query, params, files, headers)
2. **Verify Validation** - Check that all inputs are validated (DTOs, decorators, size limits)
3. **Check Sanitization** - Verify HTML/content sanitization is applied
4. **Validate Error Handling** - Verify validation errors are user-friendly and secure

**Example DTO Validation (✅):**

```typescript
// ✅ CORRECT: Comprehensive DTO validation
import { IsString, IsEmail, IsOptional, MaxLength, MinLength, Matches, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Email address',
    example: 'user@example.com',
    maxLength: 255
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email!: string;

  @ApiProperty({ 
    description: 'First name',
    example: 'John',
    maxLength: 100
  })
  @IsString({ message: 'First name must be a string' })
  @MinLength(1, { message: 'First name is required' })
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  @Matches(/^[a-zA-Z\s\-']+$/, { message: 'First name can only contain letters, spaces, hyphens, and apostrophes' })
  first_name!: string;

  @ApiPropertyOptional({ 
    description: 'Phone number',
    example: '+1-412-555-0123'
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Please provide a valid phone number' })
  phone?: string;
}
```

**Example Missing DTO Validation (❌):**

```typescript
// ❌ VIOLATION: No validation decorators
export class CreateUserDto {
  email!: string; // No validation - VIOLATION
  first_name!: string; // No validation - VIOLATION
  phone?: string; // No validation - VIOLATION
}

// ❌ VIOLATION: Using 'any' type
@Post()
async create(@Body() data: any) { // No DTO, no validation - VIOLATION
  return this.service.create(data);
}
```

**Example XSS Prevention (✅):**

```typescript
// ✅ CORRECT: HTML sanitization before storage
import { sanitizeHtml } from '@verofield/common/sanitization';

async updateDescription(userId: string, description: string) {
  // Sanitize HTML content before storage
  const sanitized = sanitizeHtml(description);
  
  return this.prisma.user.update({
    where: { id: userId },
    data: { description: sanitized }
  });
}

// ✅ CORRECT: Config sanitization (recursive)
import { sanitizeConfig } from '@verofield/common/sanitization';

async updateWidgetConfig(config: Record<string, any>) {
  // Sanitize config object recursively
  const sanitized = sanitizeConfig(config);
  
  return this.prisma.widget.update({
    where: { id: widgetId },
    data: { config: sanitized }
  });
}
```

**Example XSS Violation (❌):**

```typescript
// ❌ VIOLATION: No sanitization before storage
async updateDescription(userId: string, description: string) {
  // VIOLATION: Storing unsanitized HTML
  return this.prisma.user.update({
    where: { id: userId },
    data: { description } // Contains potential XSS vectors
  });
}

// ❌ VIOLATION: Using dangerouslySetInnerHTML without sanitization
function UserDescription({ html }: { html: string }) {
  // VIOLATION: No sanitization
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

**Example File Upload Validation (✅):**

```typescript
// ✅ CORRECT: Comprehensive file upload validation
import { IsFile, MaxFileSize, FileType } from 'nestjs-file-upload';

export class UploadPhotoDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsFile()
  @MaxFileSize(5 * 1024 * 1024, { message: 'File size must not exceed 5MB' })
  @FileType(['image/jpeg', 'image/png', 'image/webp'], { message: 'Only JPEG, PNG, and WebP images are allowed' })
  file!: Express.Multer.File;
}

@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadPhoto(@UploadedFile() file: Express.Multer.File, @Body() dto: UploadPhotoDto) {
  // Additional content validation
  if (!this.isValidImageContent(file.buffer)) {
    throw new BadRequestException('Invalid image file');
  }
  
  // Generate unique filename
  const filename = `${uuidv4()}-${file.originalname}`;
  
  // Store securely (not in public directory)
  await this.storageService.save(file.buffer, filename);
  
  return { filename };
}
```

**Example Missing File Validation (❌):**

```typescript
// ❌ VIOLATION: No file validation
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
  // VIOLATION: No type validation, no size limit, no content validation
  await this.storageService.save(file.buffer, file.originalname);
  return { filename: file.originalname };
}
```

**Example Injection Prevention (✅):**

```typescript
// ✅ CORRECT: Parameterized queries (Prisma handles this)
async findUser(email: string) {
  // Prisma uses parameterized queries automatically
  return this.prisma.user.findFirst({
    where: { email } // Safe - Prisma parameterizes
  });
}

// ✅ CORRECT: Path validation
async getFile(filename: string) {
  // Validate filename to prevent path traversal
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    throw new BadRequestException('Invalid filename');
  }
  
  // Resolve path safely
  const safePath = path.join(UPLOAD_DIR, filename);
  
  // Verify path is within upload directory
  if (!safePath.startsWith(path.resolve(UPLOAD_DIR))) {
    throw new BadRequestException('Invalid file path');
  }
  
  return fs.readFileSync(safePath);
}
```

**Example Injection Violation (❌):**

```typescript
// ❌ VIOLATION: SQL concatenation (if using raw SQL)
async findUser(email: string) {
  // VIOLATION: SQL injection risk
  return this.prisma.$queryRawUnsafe(
    `SELECT * FROM users WHERE email = '${email}'` // Dangerous!
  );
}

// ❌ VIOLATION: Path traversal
async getFile(filename: string) {
  // VIOLATION: No path validation
  return fs.readFileSync(path.join(UPLOAD_DIR, filename)); // Dangerous!
}
```

---

**Last Updated:** 2025-12-04  
**Maintained By:** Security Team  
**Review Frequency:** Quarterly or when security requirements change





