import { Module } from "@nestjs/common";

import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

import { UserRepository } from "./user.repository";
import { TypeOrmExModule } from "src/common/modules/typeorm.module";

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
