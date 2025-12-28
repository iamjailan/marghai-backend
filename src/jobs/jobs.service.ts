import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async createJob(customerId: string, data: CreateJobDto) {
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
      });
      return res;
    } catch (error: any) {
      throw new HttpException(error.message || 'Could not create job', 400);
    }
  }

  async getMyJobs(customerId: string) {
    try {
      const res = await this.prisma.job.findMany({
        where: { customerId },
      });
      return res;
    } catch (error: any) {
      throw new HttpException(error.message || 'Could not fetch jobs', 400);
    }
  }

  async getAllJobs() {
    try {
      const res = await this.prisma.job.findMany();

      return res;
    } catch (error) {
      throw new HttpException(error.message || 'Could not fetch jobs', 400);
    }
  }
}
