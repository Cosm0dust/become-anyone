import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import GraphQLJSON from 'graphql-type-json';

import { CurrentQuery } from 'src/common/decorators/query.decorator';
import { GetManyInput, GetOneInput } from 'src/common/graphql/custom.input';

import { GetUserType, User } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput } from './inputs/user.input';
import { UserService } from './user.service';
import { CustomCache } from 'src/cache/custom-cache-decorator';
import { CurrentUser } from './decorators/user.decorator';

@Resolver()
export class UserResolver {
   constructor(private readonly userService: UserService) { }

   @Query(() => GetUserType)
   @CustomCache({ logger: console.log, ttl: 1000 })
   getManyUserList(
      @Args({ name: 'input', nullable: true })
      qs: GetManyInput<User>,
      @CurrentQuery() gqlQuery: string,
   ) {
      return this.userService.getMany(qs, gqlQuery);
   }

   @Query(() => User)
   getOneUser(
      @Args({ name: 'input' })
      qs: GetOneInput<User>,
      @CurrentQuery() gqlQuery: string,
   ) {
      return this.userService.getOne(qs, gqlQuery);
   }

   @Mutation(() => User)
   createUser(@Args('input') input: CreateUserInput) {
      return this.userService.create(input);
   }

   @Mutation(() => GraphQLJSON)
   updateUser(@Args('id') id: string, @Args('input') input: UpdateUserInput) {
      return this.userService.update(id, input);
   }

   @Mutation(() => GraphQLJSON)
   deleteUser(@Args('id') id: string) {
      return this.userService.delete(id);
   }

   @Query(() => User)
   getMe(@CurrentUser() user: User) {
      return this.userService.getOne({
         where: { id: user.id },
      });
   }
}