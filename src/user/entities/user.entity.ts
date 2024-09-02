import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import {
   Column,
   CreateDateColumn,
   Entity,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm';


@ObjectType()
@Entity()
export class User {
   @Field(() => ID)
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Field(() => String)
   @IsEmail()
   @Column()
   username: string;

   @Field(() => String)
   @Column()
   email: string;


   @Field(() => String)
   @Column({ nullable: true })
   password: string;


   @Field(() => Date)
   @CreateDateColumn({
      type: 'timestamp with time zone',
   })
   createdAt: Date;

   @Field(() => Date)
   @UpdateDateColumn({
      type: 'timestamp with time zone',
   })
   updatedAt: Date;

   @Field(() => String, { nullable: true })
   @Column({ nullable: true })
   refreshToken?: string;
}

@ObjectType()
export class GetUserType {
   @Field(() => [User], { nullable: true })
   data?: User[];

   @Field(() => Number, { nullable: true })
   count?: number;
}
