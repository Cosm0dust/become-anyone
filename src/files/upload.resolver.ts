import { Args, Mutation, Resolver } from '@nestjs/graphql';

import GraphQLUpload from 'graphql-upload-ts';
import { FileUpload } from 'graphql-upload-ts';
import { UploadService } from './upload.service';

@Resolver()
export class UploadResolver {
   constructor(private readonly uploadService: UploadService) { }

}
