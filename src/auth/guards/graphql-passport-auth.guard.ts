import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GraphqlPassportAuthGuard extends AuthGuard('jwt') {
   constructor() {
      super();
   }

   getRequest(context: ExecutionContext) {
      const ctx = GqlExecutionContext.create(context);
      const req = ctx.getContext().req;
      return req;
   }
}