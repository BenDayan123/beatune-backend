import { Injectable } from '@nestjs/common';
import { UserService } from '@database/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: any): Promise<any> {
    const user = await this.userService.findOne({ username: payload.username });
    if (user && (await bcrypt.compare(payload.password, user.password))) {
      return user;
    }
    return user; //change to null
  }

  async login(user: any) {
    const { _id } = user;
    return {
      access_token: this.jwtService.sign({ _id }),
    };
  }
}
