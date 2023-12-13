import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  constructor() {
  }

  encodePassword(rowPassword: string) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(rowPassword, salt);
  }

  comparePassword(rowPassword: string, hash: string) {
    return bcrypt.compareSync(rowPassword, hash);
  }
}