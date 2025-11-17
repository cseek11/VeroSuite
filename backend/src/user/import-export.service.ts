import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { UserService } from './user.service';

export interface ImportUserRow {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  roles?: string;
  department?: string;
  position?: string;
  employee_id?: string;
}

export interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ row: number; email: string; error: string }>;
}

@Injectable()
export class ImportExportService {
  constructor(
    private db: DatabaseService,
    private userService: UserService,
  ) {}

  async exportUsers(tenantId: string): Promise<any[]> {
    try {
      const users = await this.db.user.findMany({
        where: {
          tenant_id: tenantId,
        },
        select: {
          email: true,
          first_name: true,
          last_name: true,
          phone: true,
          roles: true,
          status: true,
          employee_id: true,
          department: true,
          position: true,
          technician_number: true,
          pesticide_license_number: true,
          license_expiration_date: true,
          created_at: true,
        },
        orderBy: {
          first_name: 'asc',
        },
      });

      return users.map(user => ({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || '',
        roles: Array.isArray(user.roles) ? user.roles.join(';') : user.roles || '',
        status: user.status,
        employee_id: user.employee_id || '',
        department: user.department || '',
        position: user.position || '',
        technician_number: user.technician_number || '',
        pesticide_license_number: user.pesticide_license_number || '',
        license_expiration_date: user.license_expiration_date?.toISOString().split('T')[0] || '',
        created_at: user.created_at.toISOString(),
      }));
    } catch (error) {
      console.error('Error exporting users:', error);
      throw error;
    }
  }

  async importUsers(tenantId: string, users: ImportUserRow[]): Promise<ImportResult> {
    const result: ImportResult = {
      total: users.length,
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < users.length; i++) {
      const row = users[i];
      if (!row) continue;
      
      const rowNumber = i + 2; // +2 because row 1 is header, and arrays are 0-indexed

      try {
        // Validate required fields
        if (!row.email || !row.first_name || !row.last_name) {
          result.failed++;
          result.errors.push({
            row: rowNumber,
            email: row.email || 'N/A',
            error: 'Missing required fields: email, first_name, last_name',
          });
          continue;
        }

        // Parse roles
        const roles = row.roles
          ? row.roles.split(';').map((r: string) => r.trim()).filter((r: string) => r)
          : ['technician'];

        // Check if user already exists
        const existingUser = await this.db.user.findUnique({
          where: { email: row.email },
        });

        if (existingUser) {
          // Update existing user
          await this.db.user.update({
            where: { id: existingUser.id },
            data: {
              first_name: row.first_name,
              last_name: row.last_name,
              phone: row.phone || null,
              roles: roles,
              department: row.department || null,
              position: row.position || null,
              employee_id: row.employee_id || null,
            },
          });
        } else {
          // Create new user
          await this.userService.createUser(tenantId, {
            email: row.email,
            first_name: row.first_name,
            last_name: row.last_name,
            phone: row.phone,
            roles: roles,
          });
        }

        result.successful++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: rowNumber,
          email: row.email || 'N/A',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }

  async parseCSV(csvContent: string): Promise<ImportUserRow[]> {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }

    const firstLine = lines[0];
    if (!firstLine) {
      throw new Error('CSV file is empty');
    }

    const headers = firstLine.split(',').map(h => h.trim().replace(/"/g, ''));
    const users: ImportUserRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      
      const values = this.parseCSVLine(line);
      if (values.length === 0) continue;

      const user: any = {};
      headers.forEach((header, index) => {
        user[header] = values[index]?.trim() || '';
      });

      users.push(user as ImportUserRow);
    }

    return users;
  }

  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current);
    return values;
  }
}

