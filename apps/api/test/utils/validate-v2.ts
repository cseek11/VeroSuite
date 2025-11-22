/**
 * V2 API Response Validators
 * Use these to validate API v2 response format
 */

/**
 * Validate basic V2 response format
 * Returns data for further assertions
 */
export function expectV2Response(response: any, expectedStatus = 200) {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toMatchObject({
    data: expect.anything(),
    meta: {
      version: '2.0',
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/) // ISO 8601
    }
  });
  return response.body.data;
}

/**
 * Validate V2 paginated response format
 */
export function expectV2PaginatedResponse(response: any, expectedStatus = 200) {
  const data = expectV2Response(response, expectedStatus);
  expect(response.body.meta).toMatchObject({
    pagination: {
      page: expect.any(Number),
      limit: expect.any(Number),
      total: expect.any(Number),
      totalPages: expect.any(Number)
    }
  });
  return data;
}

/**
 * Validate V2 error response format
 */
export function expectV2ErrorResponse(response: any, expectedStatus: number) {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toMatchObject({
    error: {
      code: expect.any(String),
      message: expect.any(String)
    },
    meta: {
      version: '2.0',
      timestamp: expect.any(String)
    }
  });
  return response.body.error;
}

