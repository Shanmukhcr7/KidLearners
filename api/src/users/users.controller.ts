import { Controller, Post, Get, UseGuards, Request, Body, Put, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @UseGuards(FirebaseAuthGuard)
  async searchUsers(@Request() req: any, @Query('email') email: string) {
    const role = req.user.role;
    console.log(`[API] searchUsers called with email=${email}, role=${role}`);
    try {
      const results = await this.usersService.searchUsersByEmail(email, role);
      console.log(`[API] searchUsers returned ${results.length} results`);
      return results;
    } catch (e) {
      console.error(`[API] searchUsers error:`, e.message);
      throw e;
    }
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getUsers(@Request() req: any) {
    const role = req.user.role;
    return this.usersService.getUsers(role);
  }

  @Post('sync')
  @UseGuards(FirebaseAuthGuard)
  async syncUser(@Request() req: any) {
    const { uid, email, name } = req.user;
    return this.usersService.syncUser(uid, email, name || 'Student');
  }

  @Post('invite')
  @UseGuards(FirebaseAuthGuard)
  async inviteStudent(@Request() req: any, @Body('email') email: string) {
    const role = req.user.role;
    const schoolId = req.user.schoolId; 
    if (!schoolId) throw new Error("School ID missing on user token");
    return this.usersService.inviteStudent(email, role, schoolId);
  }

  @Put('role')
  @UseGuards(FirebaseAuthGuard)
  async updateRole(@Body('uid') uid: string, @Body('role') role: string) {
    return this.usersService.setRole(uid, role);
  }

  @Get('my-invites')
  @UseGuards(FirebaseAuthGuard)
  async getMyInvites(@Request() req: any) {
    const { uid, email } = req.user;
    return this.usersService.getStudentInvites(uid, email);
  }

  @Post('my-invites/:id/accept')
  @UseGuards(FirebaseAuthGuard)
  async acceptInvite(@Request() req: any, @Param('id') id: string) {
    const uid = req.user.uid;
    return this.usersService.acceptStudentInvite(id, uid);
  }

  @Post('my-invites/:id/reject')
  @UseGuards(FirebaseAuthGuard)
  async rejectInvite(@Request() req: any, @Param('id') id: string) {
    const uid = req.user.uid;
    return this.usersService.rejectStudentInvite(id, uid);
  }
}
