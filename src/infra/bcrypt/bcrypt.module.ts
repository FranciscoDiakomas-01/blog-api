import { Global, Module } from '@nestjs/common';
import BcriptService from './bcrypt.service';

@Module({
  providers: [BcriptService],
  exports: [BcriptService],
})
@Global()
export default class BcriptModule {}
