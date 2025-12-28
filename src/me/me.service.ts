import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { customer } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaSelect } from 'src/utils/prismaSelect';
import { UpdateUserDto } from './update-me-dto';

@Injectable()
export class MeService {
  constructor(private prisma: PrismaService) {}

  async retrieveById({
    customerId,
    fields,
  }: {
    customerId: string;
    fields?: string[];
  }): Promise<customer | null | Record<string, any>> {
    try {
      const res = await this.prisma.customer.findUnique({
        where: { id: customerId || '1234' },
        select: createPrismaSelect(fields),
      });

      if (!res) {
        throw new NotFoundException(`Customer with id ${customerId} not found`);
      }

      return res;
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not fetch profile',
        error.status || 400,
      );
    }
  }

  async deleteById(customerId: string) {
    try {
      const customer = await this.retrieveById({ customerId, fields: ['id'] });

      await this.prisma.customer.delete({
        where: { id: customer.id },
      });

      return { message: `Customer with id ${customerId} deleted successfully` };
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not delete profile',
        error.status || 400,
      );
    }
  }

  async updateById({
    customerId,
    data,
    fields,
  }: {
    customerId: string;
    data: UpdateUserDto;
    fields?: string[];
  }) {
    try {
      const customer = await this.retrieveById({ customerId, fields: ['id'] });

      const updatedCustomer = await this.prisma.customer.update({
        where: { id: customer.id },
        data: data,
        select: createPrismaSelect(fields),
      });

      return updatedCustomer;
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not update profile',
        error.status || 400,
      );
    }
  }
}
