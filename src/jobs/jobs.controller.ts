import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDTO } from './dto/update-job';

@Controller('jobs')
@UseGuards(AuthGuard('jwt'))
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
  async getMyJobs(@Req() req: any) {
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
    ];
    const id = req.user.userId;

    const res = await this.jobsService.getMyJobs({ customerId: id, fields });

    return {
      success: true,
      data: res,
    };
  }

  @Get('all')
  async getAllJobs(@Query() query: { offset: number; limit: number }) {
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
    ];
    const limit = query.limit ? Number(query.limit) : 10;
    const offset = query.offset ? Number(query.offset) : 0;

    const res = await this.jobsService.getAllJobs({ fields, limit, offset });

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
}
