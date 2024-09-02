import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { OneRepoQuery, RepoQuery } from 'src/common/graphql/types';

import { User } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput } from './inputs/user.input';
import { CustomCache } from 'src/cache/custom-cache-decorator';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(UserRepository)
      private readonly userRepository: UserRepository,
   ) { }

   @CustomCache({ logger: console.log, ttl: 1000 })
   getMany(qs: RepoQuery<User> = {}, gqlQuery?: string) {
      return this.userRepository.getMany(qs, gqlQuery);
   }

   getOne(qs: OneRepoQuery<User>, gqlQuery?: string) {
      return this.userRepository.getOne(qs, gqlQuery);
   }

   async create(input: CreateUserInput): Promise<User> {
      const user = this.userRepository.create(input);
      return await this.userRepository.save(user);
   }

   async update(id: string, input: UpdateUserInput): Promise<User> {
      const user = await this.userRepository.preload({ id, ...input });
      if (!user) {
         throw new Error('User not found');
      }
      return await this.userRepository.save(user);
   }

   async delete(id: string): Promise<void> {
      await this.userRepository.delete({ id });
   }
}