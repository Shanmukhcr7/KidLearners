import { Controller, Post, Get, UseGuards, Request, Body, Put, Query } from '@nestjs/common';
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
    // req.user contains the decoded Firebase JWT injected by our FirebaseAuthGuard
    const { uid, email, name } = req.user;
    
    // This will create a new user doc in Firestore if they don't exist
    return this.usersService.syncUser(uid, email, name || 'Student');
  }

  @Post('invite')
  @UseGuards(FirebaseAuthGuard)
  async inviteStudent(@Request() req: any, @Body('email') email: string) {
    const role = req.user.role;
    // req.user.schoolId would be injected if we saved it in claims, for now we pass a dummy ID
    const schoolId = req.user.schoolId || 'default_school_id'; 
    return this.usersService.inviteStudent(email, role, schoolId);
  }

  @Put('role')
  @UseGuards(FirebaseAuthGuard)
  async updateRole(@Body('uid') uid: string, @Body('role') role: string) {
    return this.usersService.setRole(uid, role);
  }
}
