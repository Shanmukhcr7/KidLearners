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
import { SupportModule } from './support/support.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { EventsModule } from './events/events.module';
import { GamificationModule } from './gamification/gamification.module';
import { CertificatesModule } from './certificates/certificates.module';
import { CrmModule } from './crm/crm.module';
import { SettingsModule } from './settings/settings.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule, UsersModule, SchoolsModule, DemoModule, AdminModule, CoursesModule, TasksModule, ExamsModule, AuditLogsModule, LeaderboardsModule, GalleryModule, QuestionsModule, SupportModule, AnnouncementsModule, EventsModule, GamificationModule, CertificatesModule, CrmModule, SettingsModule, AnalyticsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
