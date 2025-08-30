import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { CreateNoteDto, UpdateNoteDto } from './dto';

@Injectable()
export class CrmService {
  constructor(private readonly prisma: DatabaseService) {}

  async getAccounts() {
    // TODO: Fetch accounts from DB
    return [{ id: 'demo-account', name: 'Demo Account' }];
  }

  // Customer Notes CRUD Operations
  async getCustomerNotes(customerId: string, tenantId: string) {
    return this.prisma.customerNote.findMany({
      where: {
        tenant_id: tenantId,
        customer_id: customerId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getCustomerNote(noteId: string, tenantId: string) {
    const note = await this.prisma.customerNote.findFirst({
      where: {
        id: noteId,
        tenant_id: tenantId,
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async createCustomerNote(customerId: string, dto: CreateNoteDto, tenantId: string, userId: string) {
    // Get user info for created_by field
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { first_name: true, last_name: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.prisma.customerNote.create({
      data: {
        tenant_id: tenantId,
        customer_id: customerId,
        note_type: dto.note_type,
        note_source: dto.note_source || 'office',
        note_content: dto.note_content,
        created_by: `${user.first_name} ${user.last_name}`,
        priority: dto.priority || 'low',
        is_alert: dto.is_alert || false,
        is_internal: dto.is_internal || false,
        technician_id: dto.technician_id || null,
        work_order_id: dto.work_order_id || null,
        location_coords: dto.location_coords || null,
      },
    });
  }

  async updateCustomerNote(noteId: string, dto: UpdateNoteDto, tenantId: string) {
    // Check if note exists and belongs to tenant
    await this.getCustomerNote(noteId, tenantId);

    // Build update data object, only including defined values
    const updateData: any = {};
    
    if (dto.note_type !== undefined) updateData.note_type = dto.note_type;
    if (dto.note_source !== undefined) updateData.note_source = dto.note_source;
    if (dto.note_content !== undefined) updateData.note_content = dto.note_content;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.is_alert !== undefined) updateData.is_alert = dto.is_alert;
    if (dto.is_internal !== undefined) updateData.is_internal = dto.is_internal;
    if (dto.technician_id !== undefined) updateData.technician_id = dto.technician_id || null;
    if (dto.work_order_id !== undefined) updateData.work_order_id = dto.work_order_id || null;
    if (dto.location_coords !== undefined) updateData.location_coords = dto.location_coords || null;

    return this.prisma.customerNote.update({
      where: { id: noteId },
      data: updateData,
    });
  }

  async deleteCustomerNote(noteId: string, tenantId: string) {
    // Check if note exists and belongs to tenant
    await this.getCustomerNote(noteId, tenantId);

    return this.prisma.customerNote.delete({
      where: { id: noteId },
    });
  }
}
