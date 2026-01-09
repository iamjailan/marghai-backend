import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDTO } from './dto/update-job';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';

@Controller('customer/jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  async createJob(@Req() req: any, @Body() body: CreateJobDto) {
    const fields: string[] = [
      'id',
      'createdAt',
      'title',
      'company',
      'location',
      'type',
      'salary',
      'deadline',
      'description',
      'logo',
    ];
    const id = req.user.userId;

    const res = await this.jobsService.createJob({
      customerId: id,
      data: body,
      fields,
    });

    return {
      success: true,
      data: res,
    };
  }

  @Get('me')
  async getMyJobs(
    @Req() req: any,
    @Query() query: { offset: number; limit: number },
  ) {
    const id = req.user.userId;
    const limit = query.limit ? Number(query.limit) : 10;
    const offset = query.offset ? Number(query.offset) : 0;

    const fields: string[] = [
      'id',
      'createdAt',
      'title',
      'company',
      'location',
      'type',
      'salary',
      'deadline',
      'description',
      'logo',
    ];

    const res = await this.jobsService.getMyJobs({
      customerId: id,
      fields,
      limit,
      offset,
    });

    return {
      success: true,
      data: res.jobs,
      limit: limit,
      offset: offset,
      count: res.count,
    };
  }

  @Get()
  async getAllJobs(
    @Query() query: { offset: number; limit: number; filter: string },
  ) {
    const fields: string[] = [
      'id',
      'createdAt',
      'title',
      'company',
      'location',
      'type',
      'salary',
      'deadline',
      'description',
      'customer.id',
      'customer.first_name',
      'logo',
    ];

    const limit = Number.isFinite(Number(query.limit))
      ? Number(query.limit)
      : 10;

    const offset = Number.isFinite(Number(query.offset))
      ? Number(query.offset)
      : 0;

    const res = await this.jobsService.getAllJobs({
      fields,
      limit,
      offset,
      filter: query.filter,
    });

    return {
      success: true,
      data: res.jobs,
      limit: limit,
      offset: offset,
      count: res.count,
    };
  }

  @Put('/:id')
  async updateJob(
    @Body() body: UpdateJobDTO,
    @Req() req: any,
    @Param('id') id: string,
  ) {
    const customerId = req.user.userId;
    const fields: string[] = [
      'id',
      'createdAt',
      'title',
      'company',
      'location',
      'type',
      'salary',
      'deadline',
      'description',
      'logo',
    ];

    const res = await this.jobsService.updateJob({
      fields,
      customerId,
      data: body,
      id: id,
    });

    return {
      success: true,
      data: res,
    };
  }

  @Get('/id/:id')
  async getJobById(@Req() req: any, @Param('id') id: string) {
    const fields: string[] = [
      'id',
      'createdAt',
      'title',
      'company',
      'location',
      'type',
      'salary',
      'deadline',
      'description',
      'logo',
    ];

    const res = await this.jobsService.getJobById({
      fields,
      id: id,
    });

    return {
      success: true,
      data: res,
    };
  }

  @Delete('/id/:id')
  async deleteJobById(@Req() req: any, @Param('id') id: string) {
    const customerId = req.user.userId;

    const res = await this.jobsService.deleteJobById({
      customerId,
      id: id,
    });

    return {
      success: true,
      data: res,
    };
  }

  @Post('/id/:id/apply')
  async applyToJob(
    @Param('id') jobId: string,
    @Body() body: CreateJobApplicationDto,
  ) {
    const fields: string[] = [
      'id',
      'fullName',
      'email',
      'phone',
      'resume',
      'coverLetter',
      'createdAt',
    ];

    const res = await this.jobsService.createJobApplication({
      jobId,
      data: body,
      fields,
    });

    return {
      success: true,
      data: res,
      message: 'Application submitted successfully',
    };
  }

  @Get('/id/:id/applicants')
  async getJobApplicants(
    @Req() req: any,
    @Param('id') jobId: string,
    @Query() query: { offset: number; limit: number },
  ) {
    const customerId = req.user.userId;
    const limit = query.limit ? Number(query.limit) : 10;
    const offset = query.offset ? Number(query.offset) : 0;

    const fields: string[] = [
      'id',
      'fullName',
      'email',
      'phone',
      'resume',
      'coverLetter',
      'createdAt',
    ];

    const res = await this.jobsService.getJobApplicants({
      jobId,
      customerId,
      fields,
      limit,
      offset,
    });

    return {
      success: true,
      data: res.applications,
      limit: limit,
      offset: offset,
      count: res.count,
    };
  }

  @Get('/statistics')
  async getStatistics() {
    const res = await this.jobsService.getStatistics();

    return {
      success: true,
      data: res,
    };
  }
}
