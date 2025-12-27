import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateJobDto } from './dto/create-job.dto';

@Controller('jobs')
@UseGuards(AuthGuard('jwt'))
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  createJob(@Req() req: any, @Body() body: CreateJobDto) {
    return this.jobsService.createJob(req.user.userId, body);
  }

  @Get('my')
  getMyJobs(@Req() req: any) {
    return this.jobsService.getMyJobs(req.user.userId);
  }
}
