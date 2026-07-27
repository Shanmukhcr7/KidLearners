import { Module } from '@nestjs/common';
import { LeaderboardsController } from './leaderboards.controller';
import { LeaderboardsService } from './leaderboards.service';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [LeaderboardsController],
  providers: [LeaderboardsService],
})
export class LeaderboardsModule {}
