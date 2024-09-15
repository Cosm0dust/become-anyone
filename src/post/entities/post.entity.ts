import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany, JoinColumn } from "typeorm";
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { User } from "src/user/entities/user.entity";

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn("uuid")
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

  @Column({ nullable: true })
  @Field({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, user => user.posts, { nullable: true })
  @JoinColumn({ name: "userId" })
  @Field(() => User, { nullable: true })
  user?: User;

  @Column({ nullable: true })
  @Field({ nullable: true })
  parentId?: string;

  @ManyToOne(() => Post, post => post.children, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: "parentId" })
  @Field(() => Post, { nullable: true })
  parent?: Post;

  @OneToMany(() => Post, post => post.parent, { lazy: true })
  @Field(() => [Post], { nullable: true })
  children?: Post[];
}
