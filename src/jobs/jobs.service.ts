import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDTO } from './dto/update-job';
import { createPrismaSelect } from 'src/utils/prismaSelect';

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
          title: data.jobTitle,
          company: data.companyName,
          location: data.location,
          type: data.jobType,
          salary: data.salary,
          deadline: new Date(data.deadline),
          postedDate: new Date(),
          description: data.description,
          logo: data.companyName.substring(0, 2).toUpperCase(),
          customerId,
        },
        select: createPrismaSelect(fields),
      });
      return res;
    } catch (error: any) {
      throw new HttpException(error.message || 'Could not create job', 400);
    }
  }

  async getMyJobs({
    customerId,
    fields,
  }: {
    customerId: string;
    fields: string[];
  }) {
    try {
      const res = await this.prisma.job.findMany({
        where: { customerId },
        select: createPrismaSelect(fields),
      });
      return res;
    } catch (error: any) {
      throw new HttpException(error.message || 'Could not fetch jobs', 400);
    }
  }

  async getAllJobs({
    fields,
    limit,
    offset,
  }: {
    fields: string[];
    limit: number;
    offset: number;
  }) {
    try {
      const [jobs, count] = await this.prisma.$transaction([
        this.prisma.job.findMany({
          select: createPrismaSelect(fields),
          where: { deadline: { gt: new Date() } },
          skip: offset,
          take: limit,
        }),
        this.prisma.job.count({
          where: { deadline: { gt: new Date() } },
        }),
      ]);

      return { jobs, count };
    } catch (error) {
      throw new HttpException(error.message || 'Could not fetch jobs', 400);
    }
  }

  async getJobById({
    id,
    customerId,
    fields,
  }: {
    id: string;
    customerId: string;
    fields: string[];
  }) {
    try {
      const res = await this.prisma.job.findUnique({
        where: { id, customerId: customerId },
        select: createPrismaSelect(fields),
      });

      if (!res) {
        throw new NotFoundException(`job not found with id ${id}`);
      }

      return res;
    } catch (error) {
      throw new HttpException(error.message || 'Could not fetch jobs', 400);
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
        data: data,
        select: createPrismaSelect(fields),
      });

      return res;
    } catch (error) {
      throw new HttpException(error.message || 'Could not fetch jobs', 400);
    }
  }
}
