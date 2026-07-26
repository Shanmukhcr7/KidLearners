import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';
import { SchoolsModule } from './schools/schools.module';
import { DemoModule } from './demo/demo.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [FirebaseModule, UsersModule, SchoolsModule, DemoModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
