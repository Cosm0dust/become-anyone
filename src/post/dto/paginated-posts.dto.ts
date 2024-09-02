import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@ObjectType()
export class GetPostType {
   @Field(() => [Post], { nullable: true })
   data?: Post[];

   @Field(() => Number, { nullable: true })
   count?: number;
}
