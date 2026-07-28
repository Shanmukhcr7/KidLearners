import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';
import { SchoolsModule } from './schools/schools.module';
import { DemoModule } from './demo/demo.module';
import { AdminModule } from './admin/admin.module';
import { CoursesModule } from './courses/courses.module';
import { TasksModule } from './tasks/tasks.module';
import { ExamsModule } from './exams/exams.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { LeaderboardsModule } from './leaderboards/leaderboards.module';
import { GalleryModule } from './gallery/gallery.module';
import { QuestionsModule } from './questions/questions.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule, UsersModule, SchoolsModule, DemoModule, AdminModule, CoursesModule, TasksModule, ExamsModule, AuditLogsModule, LeaderboardsModule, GalleryModule, QuestionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
