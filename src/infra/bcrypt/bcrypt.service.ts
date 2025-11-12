import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export default class BcriptService {
  private readonly salt = 10;
  public async hash(text: string) {
    return await bcrypt.hash(text, this.salt);
  }

  public async verify(text: string, hash: string) {
    return await bcrypt.compare(text, hash);
  }
}
