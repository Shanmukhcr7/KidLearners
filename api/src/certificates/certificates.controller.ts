import { Controller, Post, Get, Put, Body, UseGuards, Req, UnauthorizedException, Param } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getTemplates(@Req() req: any) {
    return this.certificatesService.getTemplates(req.user);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createTemplate(@Body() body: any, @Req() req: any) {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'school_admin') {
      throw new UnauthorizedException('Only admins can manage certificates');
    }
    return this.certificatesService.createTemplate(body, req.user);
  }

  @Put(':id/default')
  @UseGuards(FirebaseAuthGuard)
  async setDefaultTemplate(@Param('id') id: string, @Req() req: any) {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'school_admin') {
      throw new UnauthorizedException('Only admins can manage certificates');
    }
    return this.certificatesService.setDefaultTemplate(id, req.user);
  }
}
