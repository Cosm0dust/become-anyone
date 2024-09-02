import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { Post } from './entities/post.entity';
import { UploadService } from 'src/files/upload.service';
import { FileUpload } from 'graphql-upload-ts';
import { PostRepository } from './posts.repository';
import { CreatePostInput } from './inputs/post.input';
import { CustomCache } from 'src/cache/custom-cache-decorator';
import { RepoQuery } from 'src/common/graphql/types';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
    private readonly uploadService: UploadService,
  ) { }

  async create(createPostInput: CreatePostInput, files: FileUpload[]): Promise<Post> {
    const filesKeys = await this.uploadService.processFiles(files);
    const { recaptchaToken, ...rest } = createPostInput
    const newPost = this.postRepository.create({ ...rest, ...filesKeys } as DeepPartial<Post>);
    return await this.postRepository.save(newPost);
  }


  @CustomCache({ logger: console.log, ttl: 1000 })
  async getMany(qs: RepoQuery<Post> = {}, gqlQuery?: string) {
    return await this.postRepository.getMany(qs, gqlQuery);
  }
}

