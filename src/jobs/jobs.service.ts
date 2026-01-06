import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDTO } from './dto/update-job';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { createPrismaSelect } from 'src/utils/prismaSelect';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  private async findJobById({
    id,
    customerId,
    select,
  }: {
    id: string;
    customerId?: string;
    select?: Prisma.jobSelect;
  }) {
    const where: Prisma.jobWhereUniqueInput = {
      id: id,
    };

    if (customerId) {
      where.customerId = customerId;
    }

    return await this.prisma.job.findUnique({
      where,
      select,
    });
  }

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
    filter,
  }: {
    fields: string[];
    limit: number;
    offset: number;
    customerId?: string;
    filter?: string;
  }) {
    const where: Prisma.jobWhereInput = {
      deadline: { gt: new Date() },
    };

    if (customerId) {
      where.customerId = customerId;
    }

    if (filter?.trim()) {
      const filters = filter.split(',');

      for (const item of filters) {
        const [key, value] = item.split('=');

        if (!value) continue;

        if (key === 'title') {
          where.title = {
            contains: value,
            mode: 'insensitive',
          };
        }

        if (key === 'location') {
          where.location = {
            contains: value,
            mode: 'insensitive',
          };
        }
      }
    }

    try {
      const [jobs, count] = await this.prisma.$transaction([
        this.prisma.job.findMany({
          select: createPrismaSelect(fields),
          where,
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
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
      const res = await this.findJobById({
        id,
        customerId,
        select: createPrismaSelect(fields),
      });

      if (!res) {
        throw new NotFoundException(`job not found with id ${id}`);
      }

      // Get application count
      const applicationCount = await this.getJobApplicationCount(id);

      return {
        ...res,
        applicationCount,
      };
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

  async createJobApplication({
    jobId,
    data,
    fields,
  }: {
    jobId: string;
    data: CreateJobApplicationDto;
    fields: string[];
  }) {
    try {
      const job = await this.findJobById({
        id: jobId,
      });

      if (!job) {
        throw new NotFoundException(`Job not found with id ${jobId}`);
      }

      if (new Date(job.deadline) < new Date()) {
        throw new HttpException('Job application deadline has passed', 400);
      }

      const res = await this.prisma.jobApplication.create({
        data: {
          jobId,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          resume: data.resume,
          coverLetter: data.coverLetter,
        },
        select: createPrismaSelect(fields),
      });

      return res;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Could not create job application';
      const status = error instanceof HttpException ? error.getStatus() : 400;
      throw new HttpException(message, status);
    }
  }

  async getJobApplicants({
    jobId,
    customerId,
    fields,
    limit,
    offset,
  }: {
    jobId: string;
    customerId: string;
    fields: string[];
    limit: number;
    offset: number;
  }) {
    try {
      const job = await this.findJobById({
        id: jobId,
        customerId,
        select: { customerId: true },
      });

      if (!job) {
        throw new NotFoundException(`Job not found with id ${jobId}`);
      }

      const [applications, count] = await this.prisma.$transaction([
        this.prisma.jobApplication.findMany({
          where: { jobId },
          select: createPrismaSelect(fields),
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.jobApplication.count({
          where: { jobId },
        }),
      ]);

      return { applications, count };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      const message =
        error instanceof Error
          ? error.message
          : 'Could not fetch job applicants';
      throw new HttpException(message, 400);
    }
  }

  async getJobApplicationCount(jobId: string): Promise<number> {
    try {
      const count = await this.prisma.jobApplication.count({
        where: { jobId },
      });
      return count;
    } catch {
      return 0;
    }
  }

  async getStatistics() {
    try {
      const [totalCustomers, totalJobs, totalApplicants] =
        await this.prisma.$transaction([
          this.prisma.customer.count(),
          this.prisma.job.count(),
          this.prisma.jobApplication.count(),
        ]);

      return {
        totalCustomers,
        totalJobs,
        totalApplicants,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not fetch statistics',
        error.status || 400,
      );
    }
  }
}
