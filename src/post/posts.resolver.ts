import { Resolver, Mutation, Args, Int, Query, Subscription } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { GetPostType } from './dto/paginated-posts.dto';
import { CustomCache } from 'src/cache/custom-cache-decorator';
import { CreatePostInput } from './inputs/post.input';
import { GetManyInput } from 'src/common/graphql/custom.input';
import { CurrentQuery } from 'src/common/decorators/query.decorator';
import { RecaptchaValidationPipe } from './pipes/recapcha.pipe';
import { TextValidationPipe } from './pipes/postText.pipe';
import { HtmlValidationPipe } from './pipes/htmlText.pipe';
import { Inject, UseInterceptors, UsePipes } from '@nestjs/common';
import { SignedUrlInterceptor } from './interceptors/signedUrl.interceptor';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService, @Inject('PUB_SUB') private readonly pubSub: PubSub,) {
  }


  @Mutation(() => Post)
  @UsePipes(RecaptchaValidationPipe)
  async createPost(
    @Args('input', new TextValidationPipe(), new HtmlValidationPipe()) createPostInput: CreatePostInput,
    @Args('files', { type: () => [GraphQLUpload], nullable: true }) files?: FileUpload[],
  ): Promise<Post> {
    const post = this.postsService.create(createPostInput, files);
    await this.pubSub.publish('postCreated', { postCreated: post });
    return post;
  }

  @Query(() => GetPostType)
  @CustomCache({ logger: console.log, ttl: 1000 })
  @UseInterceptors(SignedUrlInterceptor)
  async getManyPostsList(
    @Args({ name: 'input', nullable: true }) qs: GetManyInput<Post>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.postsService.getMany(qs, gqlQuery);
  }

  @Subscription(() => Post, {
    resolve: value => value.postCreated,
  })
  postCreated() {
    return this.pubSub.asyncIterator('postCreated');
  }
}


