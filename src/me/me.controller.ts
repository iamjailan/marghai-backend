import { Body, Controller, Delete, Get, Put, Req } from '@nestjs/common';
import { MeService } from './me.service';
import { UpdateUserDto } from './dto/update-me-dto';

@Controller('customer/me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  async getProfile(@Req() req: any) {
    const customerId = req?.user?.userId;

    const fields = [
      'id',
      'createdAt',
      'email',
      'profile_picture',
      'company',
      'location',
      'phone',
    ];

    const res = await this.meService.retrieveById({ customerId, fields });

    return {
      success: true,
      data: res,
    };
  }

  @Put()
  async updateProfile(@Req() req: any, @Body() body: UpdateUserDto) {
    const customerId = req?.user?.userId;
    const fields = [
      'id',
      'createdAt',
      'email',
      'profile_picture',
      'company',
      'location',
      'phone',
    ];

    const res = await this.meService.updateById({
      customerId,
      data: body,
      fields,
    });

    return {
      success: true,
      data: res,
    };
  }

  @Delete()
  async deleteProfile(@Req() req: any) {
    const customerId = req?.user?.userId;
    const res = await this.meService.deleteById(customerId);

    return {
      success: true,
      data: res,
    };
  }
}
