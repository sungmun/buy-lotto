import { Module } from '@nestjs/common';
import { DonghangService } from './donghang.service';

@Module({
  providers: [DonghangService],
  exports:[DonghangService]
})
export class DonghangModule {}
