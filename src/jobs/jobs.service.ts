import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDTO } from './dto/update-job';
import { createPrismaSelect } from 'src/utils/prismaSelect';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async createJob({
    customerId,
    data,
    fields,
  }: {
    customerId: string;
    data: CreateJobDto;
    fields: string[];
  }) {
    try {
      const res = await this.prisma.job.create({
        data: {
          title: data.title,
          company: data.company,
          location: data.location,
          type: data.type,
          salary: data.salary,
          deadline: new Date(data.deadline),
          postedDate: new Date(),
          description: data.description,
          logo: data.company.substring(0, 2).toUpperCase(),
          customerId,
        },
        select: createPrismaSelect(fields),
      });
      return res;
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Could not create job',
        error.status || 400,
      );
    }
  }

  async getMyJobs({
    customerId,
    fields,
    limit,
    offset,
  }: {
    customerId: string;
    fields: string[];
    limit: number;
    offset: number;
  }) {
    try {
      const res = await this.getAllJobs({ fields, limit, offset, customerId });
      return res;
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Could not fetch jobs',
        error.status || 400,
      );
    }
  }

  async getAllJobs({
    fields,
    limit,
    offset,
    customerId,
  }: {
    fields: string[];
    limit: number;
    offset: number;
    customerId?: string;
  }) {
    const where: Prisma.jobWhereInput = {
      deadline: { gt: new Date() },
    };

    if (customerId) {
      where.customerId = customerId;
    }

    try {
      const [jobs, count] = await this.prisma.$transaction([
        this.prisma.job.findMany({
          select: createPrismaSelect(fields),
          where,
          skip: offset,
          take: limit,
        }),
        this.prisma.job.count({
          where,
        }),
      ]);

      return { jobs, count };
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not fetch jobs',
        error.status || 400,
      );
    }
  }

  async getJobById({
    id,
    customerId,
    fields,
  }: {
    id: string;
    customerId?: string;
    fields: string[];
  }) {
    try {
      const where: Prisma.jobWhereUniqueInput = {
        id: id,
      };

      if (customerId) {
        where.customerId = customerId;
      }

      const res = await this.prisma.job.findUnique({
        where: where,
        select: createPrismaSelect(fields),
      });

      if (!res) {
        throw new NotFoundException(`job not found with id ${id}`);
      }

      return res;
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not fetch jobs',
        error.status || 400,
      );
    }
  }

  async updateJob({
    id,
    customerId,
    data,
    fields,
  }: {
    id: string;
    customerId: string;
    data: UpdateJobDTO;
    fields: string[];
  }) {
    try {
      await this.getJobById({ customerId, id, fields: ['id'] });

      const res = await this.prisma.job.update({
        where: { id: id },
        data: {
          title: data.title,
          company: data.company,
          location: data.location,
          type: data.type,
          salary: data.salary,
          deadline: new Date(data.deadline),
          postedDate: new Date(),
          description: data.description,
          logo: data.company.substring(0, 2).toUpperCase(),
          customerId,
        },
        select: createPrismaSelect(fields),
      });

      return res;
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not fetch jobs',
        error.status || 400,
      );
    }
  }

  async deleteJobById({ id, customerId }: { id: string; customerId: string }) {
    try {
      await this.getJobById({ customerId, id, fields: ['id'] });

      await this.prisma.job.delete({
        where: { id: id },
      });

      return `${id} deleted successfully`;
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not fetch jobs',
        error.status || 400,
      );
    }
  }
}
