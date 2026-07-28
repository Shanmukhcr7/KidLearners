import { Controller, Post, Get, Put, Body, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { CrmService } from './crm.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('leads')
  @UseGuards(FirebaseAuthGuard)
  async getLeads(@Req() req: any) {
    if (req.user?.role !== 'super_admin') {
      throw new UnauthorizedException('Only super admins can view CRM leads');
    }
    return this.crmService.getLeads();
  }

  @Post('leads')
  @UseGuards(FirebaseAuthGuard)
  async createLead(@Body() body: any, @Req() req: any) {
    if (req.user?.role !== 'super_admin') {
      throw new UnauthorizedException('Only super admins can create CRM leads');
    }
    return this.crmService.createLead(body);
  }

  @Put('leads/:id/stage')
  @UseGuards(FirebaseAuthGuard)
  async updateLeadStage(@Param('id') id: string, @Body() body: { stage: string }, @Req() req: any) {
    if (req.user?.role !== 'super_admin') {
      throw new UnauthorizedException('Only super admins can update CRM leads');
    }
    return this.crmService.updateLeadStage(id, body.stage);
  }
}
