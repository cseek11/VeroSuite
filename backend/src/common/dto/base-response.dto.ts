import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseResponseDto<T = any> {
  @ApiProperty({ description: 'Indicates if the operation was successful' })
  success!: boolean;

  @ApiProperty({ description: 'Response message' })
  message!: string;

  @ApiPropertyOptional({ description: 'Response data' })
  data?: T;

  @ApiPropertyOptional({ description: 'Error details if operation failed' })
  error?: {
    code: string;
    details?: any;
  };

  @ApiProperty({ description: 'Timestamp of the response' })
  timestamp!: string;

  constructor(data?: T, message: string = 'Operation successful', success: boolean = true) {
    this.success = success;
    this.message = message;
    this.data = data as T;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data?: T, message?: string): BaseResponseDto<T> {
    return new BaseResponseDto(data, message, true);
  }

  static error(message: string, code?: string, details?: any): BaseResponseDto {
    const response = new BaseResponseDto(undefined, message, false);
    if (code || details) {
      response.error = { code: code || 'UNKNOWN_ERROR', details };
    }
    return response;
  }
}

export class PaginatedResponseDto<T = any> extends BaseResponseDto<T[]> {
  @ApiProperty({ description: 'Pagination metadata' })
  pagination!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };

  constructor(
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
    },
    message: string = 'Data retrieved successfully'
  ) {
    super(data, message, true);
    
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    
    this.pagination = {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrevious: pagination.page > 1,
    };
  }

  static create<T>(
    data: T[],
    pagination: { page: number; limit: number; total: number },
    message?: string
  ): PaginatedResponseDto<T> {
    return new PaginatedResponseDto(data, pagination, message);
  }
}
