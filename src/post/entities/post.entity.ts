import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  text: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  homepage: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  imageKey?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  textFileKey?: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @ManyToOne(() => User, user => user.id)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Post, comment => comment.id, { nullable: true })
  @Field(() => Post, { nullable: true })
  parentComment: Post;
}

