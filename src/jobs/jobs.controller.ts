import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateJobDto } from './dto/create-job.dto';

@Controller('jobs')
@UseGuards(AuthGuard('jwt'))
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  async createJob(@Req() req: any, @Body() body: CreateJobDto) {
    const res = await this.jobsService.createJob(req.user.userId, body);

    return {
      success: true,
      data: res,
    };
  }

  @Get('me')
  async getMyJobs(@Req() req: any) {
    const res = await this.jobsService.getMyJobs(req.user.userId);

    return {
      success: true,
      data: res,
    };
  }

  @Get('all')
  async getAllJobs() {
    const res = await this.jobsService.getAllJobs();

    return {
      success: true,
      data: res,
    };
  }
}
