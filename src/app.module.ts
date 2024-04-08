import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DonghangModule } from './donghang/donghang.module';
import { DonghangService } from './donghang/donghang.service';

@Module({
  imports: [DonghangModule],
  controllers: [AppController],
  providers: [AppService, DonghangService],
})
export class AppModule {}
