import { InputType, Field } from '@nestjs/graphql';
import {
   IsNotEmpty,
   IsString,
   IsOptional,
   MaxLength,
   IsEmail,
   IsUrl,
   Matches
} from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { Post } from '../entities/post.entity';

@InputType()
export class CreatePostInput implements Partial<Post> {
   @Field()
   @IsNotEmpty()
   @Matches(/^[A-Za-z0-9]+$/, { message: 'User Name must contain only letters and numbers.' })
   @MaxLength(255)
   username: string;

   @Field()
   @IsNotEmpty()
   @IsEmail({}, { message: 'Email must be in a valid format.' })
   email: string;

   @Field({ nullable: true })
   @IsOptional()
   @IsUrl({}, { message: 'Home page must be a valid URL.' })
   homepage?: string;

   @Field()
   @IsNotEmpty()
   @IsString()
   @MaxLength(255)
   text: string;

   @Field({ nullable: true })
   @IsOptional()
   @IsString()
   @MaxLength(255)
   parentCommentId?: string;

   @Field()
   @IsNotEmpty()
   @IsString()
   recaptchaToken: string;

   @Field()
   @IsNotEmpty()
   @IsString()
   userId: string;


   @IsOptional()
   @Field(() => [GraphQLUpload], { nullable: true })
   files?: FileUpload[];
}