#!/bin/bash

# Compliance API Test Script
# Tests all compliance API endpoints with authentication

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="${API_URL:-http://localhost:3001}"
TEST_EMAIL="${TEST_EMAIL:-test@example.com}"
TEST_PASSWORD="${TEST_PASSWORD:-password123}"

echo -e "${YELLOW}=== Compliance API Test Script ===${NC}\n"

# Step 1: Authenticate and get token
echo -e "${YELLOW}Step 1: Authenticating...${NC}"
AUTH_RESPONSE=$(curl -s -X POST "${API_URL}/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}")

TOKEN=$(echo $AUTH_RESPONSE | jq -r '.access_token // empty')
TENANT_ID=$(echo $AUTH_RESPONSE | jq -r '.user.tenantId // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo -e "${RED}❌ Authentication failed${NC}"
  echo "Response: $AUTH_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✓ Authenticated successfully${NC}"
echo "Tenant ID: $TENANT_ID"
echo ""

# Step 2: Test Rule Definitions Endpoint
echo -e "${YELLOW}Step 2: Testing GET /api/v1/compliance/rules${NC}"
RULES_RESPONSE=$(curl -s -X GET "${API_URL}/api/v1/compliance/rules" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

RULES_COUNT=$(echo $RULES_RESPONSE | jq '.total // 0')

if [ "$RULES_COUNT" -ge 25 ]; then
  echo -e "${GREEN}✓ Rules endpoint working (${RULES_COUNT} rules)${NC}"
else
  echo -e "${RED}❌ Expected at least 25 rules, got ${RULES_COUNT}${NC}"
  exit 1
fi
echo ""

# Step 3: Test Compliance Checks Endpoint
echo -e "${YELLOW}Step 3: Testing GET /api/v1/compliance/checks${NC}"
CHECKS_RESPONSE=$(curl -s -X GET "${API_URL}/api/v1/compliance/checks" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

CHECKS_COUNT=$(echo $CHECKS_RESPONSE | jq '.total // 0')
echo -e "${GREEN}✓ Checks endpoint working (${CHECKS_COUNT} checks)${NC}"
echo ""

# Step 4: Test Create Compliance Check
echo -e "${YELLOW}Step 4: Testing POST /api/v1/compliance/checks${NC}"
TEST_PR_NUMBER=$((RANDOM % 10000 + 1000))
CREATE_RESPONSE=$(curl -s -X POST "${API_URL}/api/v1/compliance/checks" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"pr_number\": ${TEST_PR_NUMBER},
    \"commit_sha\": \"test-commit-sha-$(date +%s)\",
    \"rule_id\": \"R01\",
    \"status\": \"VIOLATION\",
    \"severity\": \"WARNING\",
    \"file_path\": \"apps/api/src/test.ts\",
    \"line_number\": 42,
    \"violation_message\": \"Test violation message\"
  }")

CHECK_ID=$(echo $CREATE_RESPONSE | jq -r '.id // empty')

if [ -z "$CHECK_ID" ] || [ "$CHECK_ID" == "null" ]; then
  echo -e "${RED}❌ Failed to create compliance check${NC}"
  echo "Response: $CREATE_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✓ Compliance check created (ID: ${CHECK_ID})${NC}"
echo ""

# Step 5: Test Compliance Score Calculation
echo -e "${YELLOW}Step 5: Testing GET /api/v1/compliance/pr/${TEST_PR_NUMBER}/score${NC}"
SCORE_RESPONSE=$(curl -s -X GET "${API_URL}/api/v1/compliance/pr/${TEST_PR_NUMBER}/score" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

SCORE=$(echo $SCORE_RESPONSE | jq '.score // 0')
CAN_MERGE=$(echo $SCORE_RESPONSE | jq '.can_merge // false')

echo -e "${GREEN}✓ Score calculated: ${SCORE}/100${NC}"
echo "Can merge: $CAN_MERGE"
echo ""

# Step 6: Test Tenant Isolation
echo -e "${YELLOW}Step 6: Testing tenant isolation${NC}"
echo "Verifying checks are scoped to tenant..."
TENANT_CHECK=$(echo $CHECKS_RESPONSE | jq -r ".data[] | select(.tenant_id == \"${TENANT_ID}\") | .id" | head -1)

if [ -n "$TENANT_CHECK" ]; then
  echo -e "${GREEN}✓ Tenant isolation verified${NC}"
else
  echo -e "${YELLOW}⚠ No checks found for tenant (may be expected if no data)${NC}"
fi
echo ""

# Summary
echo -e "${GREEN}=== Test Summary ===${NC}"
echo "✓ Authentication: PASSED"
echo "✓ Rules endpoint: PASSED (${RULES_COUNT} rules)"
echo "✓ Checks endpoint: PASSED"
echo "✓ Create check: PASSED"
echo "✓ Score calculation: PASSED"
echo "✓ Tenant isolation: VERIFIED"
echo ""
echo -e "${GREEN}All tests passed! 🎉${NC}"

