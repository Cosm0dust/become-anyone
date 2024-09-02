import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SignInInput, SignUpInput } from 'src/auth/inputs/auth.input';

import { AuthService } from './auth.service';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { RefreshGuard } from './guards/graphql-refresh.guard';
import { SignInGuard } from './guards/graphql-signin.guard';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtWithUser } from './entities/auth_entiity';
import { GraphqlPassportAuthGuard } from './guards/graphql-passport-auth.guard';

@Resolver()
export class AuthResolver {
   constructor(
      private readonly authService: AuthService,
      private readonly userService: UserService,
   ) { }

   @Mutation(() => JwtWithUser)
   @UseGuards(SignInGuard)
   signIn(@Args('input') _: SignInInput, @CurrentUser() user: User) {
      return this.authService.signIn(user);
   }

   @Mutation(() => JwtWithUser)
   signUp(@Args('input') input: SignUpInput) {
      return this.authService.signUp(input);
   }

   @Mutation(() => Boolean)
   @UseGuards(GraphqlPassportAuthGuard)
   async signOut(@CurrentUser() user: User) {
      await this.userService.update(user.id, { refreshToken: null });
      return true;
   }

   @Mutation(() => JwtWithUser)
   @UseGuards(GraphqlPassportAuthGuard)
   refreshAccessToken(@CurrentUser() user: User) {
      const jwt = this.authService.generateAccessToken(user, user.refreshToken);
      return { jwt, user };
   }
}

